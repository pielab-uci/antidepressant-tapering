import {
  add, areIntervalsOverlapping, differenceInCalendarDays, format, isAfter, isBefore, sub,
} from 'date-fns';
import {
  OralDosage, PrescribedDrug, TableRowData, Converted, Prescription, ValueOf,
} from '../../types';
import { Schedule } from '../../components/Schedule/ProjectedSchedule';

export const isCompleteDrugInput = (drug: PrescribedDrug) => {
  return drug.name !== ''
    && drug.brand !== ''
    && drug.form !== ''
    && drug.intervalEndDate !== null
    && drug.intervalCount !== 0
    && drug.upcomingDosages.length !== 0;
};

export const completePrescribedDrugs = (drugs: PrescribedDrug[] | null | undefined): PrescribedDrug[] | [] => {
  return drugs ? drugs.filter((drug) => isCompleteDrugInput(drug)) : [];
};

export const validateCompleteInputs = (drugs: PrescribedDrug[] | null | undefined): boolean => {
  return !(drugs === null || drugs === undefined || drugs.length === 0) && drugs
    .map((drug) => isCompleteDrugInput(drug))
    .every((cond) => cond);
};

const rowIntervalOverlapping = (prev: TableRowData, current: TableRowData) => {
  return prev.drug === current.drug
    && (areIntervalsOverlapping(
      { start: prev.startDate!, end: prev.endDate! },
      { start: current.startDate!, end: current.endDate! },
      { inclusive: true },
    ));
};

const rowIntervalIsAfter = (fromPrev: TableRowData, fromCurrent: TableRowData) => {
  return fromPrev.drug === fromCurrent.drug
    && isAfter(fromPrev.startDate!, fromCurrent.endDate!);
};

const convert = (drugs: PrescribedDrug[]): Converted[] => {
  return drugs.map((drug) => {
    const priorDosageSum = drug.priorDosages
      .reduce((acc, d) => acc + parseFloat(d.dosage) * d.quantity, 0);
    const upcomingDosageSum = drug.upcomingDosages
      .reduce((acc, d) => acc + parseFloat(d.dosage) * d.quantity, 0);

    const changeDirection = (() => {
      if (priorDosageSum < upcomingDosageSum) {
        return 'increase';
      }
      if (priorDosageSum > upcomingDosageSum) {
        return 'decrease';
      }
      return 'same';
    })();

    return {
      ...drug,
      priorDosageSum,
      upcomingDosageSum,
      changeAmount: upcomingDosageSum - priorDosageSum,
      changeRate: upcomingDosageSum / priorDosageSum,
      intervalEndDate: drug.intervalEndDate!,
      changeDirection,
    };
  });
};

const calcProjectedDosages = (drug: Converted, prescribedDosage: number, length: number): number[] => {
  const res: number[] = [];
  res.push(prescribedDosage);

  // increasing
  if (drug.changeDirection === 'increase') {
    Array(length - 1).fill(null).forEach((_, i) => {
      if (res[i] + drug.changeAmount < drug.targetDosage!) {
        res.push(res[i] + drug.changeAmount);
      } else {
        res.push(drug.targetDosage!);
      }
    });
  } else {
    // decreasing
    const minDosage = parseFloat(drug.availableDosageOptions[0]);
    Array(length - 1).fill(null).forEach((_, i) => {
      const nextTemp = drug.changeRate * res[i];
      const remainder = nextTemp % minDosage;

      if (nextTemp < drug.targetDosage!) {
        res.push(drug.targetDosage!);
      } else if (remainder === 0) {
        res.push(nextTemp);
      } else {
        const floor = Math.floor(nextTemp / minDosage) * minDosage;
        const ceiling = Math.ceil(nextTemp / minDosage) * minDosage;

        if (i === length - 2 && drug.form === 'tablet' && drug.allowSplittingUnscoredTablet) {
          res.push(ceiling - minDosage / 2);
        } else if (ceiling === res[i]) {
          res.push(floor);
        } else if (ceiling > nextTemp) {
          res.push(floor);
        } else {
          res.push(ceiling);
        }
      }
    });
  }
  return res;
};

const subtractDosageOptionsFromDosage = (dosage: number, dosageOptions: string[]): [number, { [dosage: string]: number }] => {
  const dosages: { [dosage: string]: number } = {};
  let d = dosage;
  dosageOptions.concat()
    .sort((a, b) => parseFloat(b) - parseFloat(a))
    .forEach((dos) => {
      const quot = Math.floor(d / parseFloat(dos));
      if (quot >= 1) {
        // while (quot >= 1) {
        dosages[dos] = quot;
        d -= quot * parseFloat(dos);
      }
    });

  return [d, dosages];
};

export const calcMinimumQuantityForDosage = (availableOptions: string[], dosage: number, regularDosageOptions: string[] | null): { [dosageQty: string]: number } => {
  if (dosage === 0) {
    const putZeros = (prev: { [p: string]: number }, option: string) => {
      prev[option] = 0;
      return prev;
    };

    if (regularDosageOptions) {
      return regularDosageOptions.reduce(putZeros, {});
    }
    return availableOptions.reduce(putZeros, {});
  }

  if (regularDosageOptions) { // in case of tablet or capsules
    const [d, dosages] = subtractDosageOptionsFromDosage(dosage, regularDosageOptions);

    if (d > 0) {
      const splittingOption = availableOptions.find((option) => parseFloat(option) === d);
      if (!splittingOption) {
        console.error('dosage case not covered.');
        return dosages;
      }

      const dosageToAdd = regularDosageOptions.find((dos) => parseFloat(splittingOption) / parseFloat(dos) === 0.5);
      if (!dosageToAdd) {
        console.error('dosage case not covered. - no dosage to split');
        return dosages;
      }
      if (dosages[dosageToAdd]) {
        dosages[dosageToAdd] += 0.5;
      } else {
        dosages[dosageToAdd] = 0.5;
      }
    }
    return dosages;
  }

  // oral solution / suspense
  let [d, dosages] = subtractDosageOptionsFromDosage(dosage, availableOptions);

  if (Object.values(dosages).every((qty) => qty === 0)) {
    dosages[availableOptions[0]] = 1;
    d = 0;
  }

  if (d > 0) {
    dosages[availableOptions[0]] += 1;
  }
  return dosages;
};

type PrescriptionFunction = (args: { form: string, intervalCount: number, intervalUnit: 'Days' | 'Weeks' | 'Months' | null, oralDosageInfo?: OralDosage | null }, dosageQty: { [dosage: string]: number }) => string;
export const prescription: PrescriptionFunction = (
  {
    form, intervalCount, intervalUnit, oralDosageInfo,
  },
  dosageQty,
) => {
  console.log('oralDosageInfo: ', oralDosageInfo);
  return Object.entries(dosageQty)
    .filter(([dosage, qty]) => qty !== 0)
    .reduce((res, [dosage, qty], i, arr) => {
      if (oralDosageInfo) {
        return `${res} ${qty / oralDosageInfo.rate.mg * oralDosageInfo.rate.ml}ml ${form} for ${intervalCount} ${intervalUnit!.toLowerCase()}`;
      }

      if (i === arr.length - 1) {
        return `${res} ${qty} * ${dosage} ${form} for ${intervalCount} ${intervalUnit!.toLowerCase()}`;
      }

      return `${res} ${qty} * ${dosage} ${form}, `;
    }, '');
};

const projectionLengthOfEachDrug = (drug: Converted): number => {
  if (drug.changeDirection === 'increase') {
    return Math.floor(drug.targetDosage! / drug.changeAmount) + 1;
  }
  return Math.floor(Math.log(drug.targetDosage!) / Math.log(1 / drug.changeRate)) + 1;
};

const generateTableRows = (drugs: Converted[]): TableRowData[] => {
  // const lengthOfProjection = Math.max(...drugs.map(projectionLengthOfEachDrug));

  const tableRowsByDrug = drugs.map((drug) => {
    const rows: TableRowData[] = [];
    const durationInDaysCount = { days: differenceInCalendarDays(drug.intervalEndDate, drug.intervalStartDate) + 1 };
    const lengthOfProjection = projectionLengthOfEachDrug(drug);
    const upcomingDosages = calcProjectedDosages(drug, drug.upcomingDosageSum, lengthOfProjection);

    rows.push({
      prescribedDrugId: drug.id,
      drug: drug.name,
      brand: drug.brand,
      dosage: upcomingDosages[0],
      startDate: drug.intervalStartDate,
      endDate: drug.intervalEndDate,
      prescription: prescription({ ...drug }, drug.upcomingDosages.reduce(
        (prev, d) => ({ ...prev, [d.dosage]: d.quantity }), {},
      )),
      unitDosages: drug.upcomingDosages.reduce((prev, { dosage, quantity }) => {
        prev[dosage] = quantity;
        return prev;
      }, {} as { [dosage: string]: number }),
      addedInCurrentVisit: !drug.prevVisit,
      selected: !drug.prevVisit,
      availableDosageOptions: drug.availableDosageOptions,
      regularDosageOptions: drug.regularDosageOptions,
      form: drug.form,
      isPriorDosage: false,
      intervalDurationDays: drug.intervalDurationDays,
      intervalCount: drug.intervalCount,
      intervalUnit: drug.intervalUnit,
      measureUnit: drug.measureUnit,
      oralDosageInfo: drug.oralDosageInfo ? drug.oralDosageInfo : undefined,
    });

    const projectionStartDate = add(drug.intervalEndDate, { days: 1 });
    const newEndDate = sub(add(projectionStartDate, durationInDaysCount), { days: 1 });
    const newRowData = {
      Drug: drug.name,
      upcomingDosageSum: upcomingDosages[1],
      // prescribedDosages: calcMinimumQuantityForDosage(drug.availableDosageOptions, upcomingDosages[1], drug.regularDosageOptions),
      unitDosages: calcMinimumQuantityForDosage(drug.availableDosageOptions, upcomingDosages[1], drug.regularDosageOptions),
      startDate: projectionStartDate,
      endDate: newEndDate,
      selected: false,
      form: drug.form,
      Prescription: '',
      intervalCount: drug.intervalCount,
      intervalUnit: drug.intervalUnit,
      oralDosageInfo: drug.oralDosageInfo ? drug.oralDosageInfo : undefined,
    };

    Array(lengthOfProjection - 1).fill(null).forEach((_, i) => {
      if (newRowData.upcomingDosageSum !== 0) {
        rows.push({
          prescribedDrugId: drug.id,
          drug: drug.name,
          brand: drug.brand,
          dosage: newRowData.upcomingDosageSum,
          startDate: newRowData.startDate,
          endDate: newRowData.endDate,
          prescription: prescription({ ...drug }, newRowData.unitDosages),
          selected: false,
          addedInCurrentVisit: !drug.prevVisit,
          availableDosageOptions: drug.availableDosageOptions,
          regularDosageOptions: drug.regularDosageOptions,
          unitDosages: newRowData.unitDosages,
          isPriorDosage: false,
          intervalDurationDays: drug.intervalDurationDays,
          intervalCount: drug.intervalCount,
          intervalUnit: drug.intervalUnit,
          measureUnit: drug.measureUnit,
          form: drug.form,
          oralDosageInfo: drug.oralDosageInfo ? drug.oralDosageInfo : undefined,
        });

        newRowData.upcomingDosageSum = upcomingDosages[i + 2];
        newRowData.unitDosages = calcMinimumQuantityForDosage(drug.availableDosageOptions, newRowData.upcomingDosageSum, drug.regularDosageOptions);
        newRowData.startDate = add(newRowData.endDate, { days: 1 });
        newRowData.endDate = sub(add(newRowData.startDate, durationInDaysCount), { days: 1 });
      }
    });
    return { drug: drug.name, lastEndDate: rows[rows.length - 1].endDate!, rows };
  });

  const endDates = tableRowsByDrug.map((d) => d.lastEndDate);
  const lastEndDateAndIndex: [number, Date] = endDates.reduce(([i, prev], curr, j) => {
    if (isAfter(prev, curr)) {
      return [i, prev];
    }
    return [j, curr];
  }, [0, endDates[0]]);

  tableRowsByDrug.forEach((drug, i) => {
    if (i !== lastEndDateAndIndex[0]) {
      drug.rows.push({
        ...drug.rows[drug.rows.length - 1],
        startDate: add(drug.lastEndDate, { days: 1 }),
        endDate: lastEndDateAndIndex[1],
      });
    }
  });

  return tableRowsByDrug.flatMap((drug) => drug.rows);
};

const checkIntervalOverlappingRows = (rows: TableRowData[]): TableRowData[] => {
  const rowsAddedInCurrentVisit = rows.filter((row) => row.addedInCurrentVisit);
  const rowsFromPreviousVisits = rows.filter((row) => !row.addedInCurrentVisit);

  rowsAddedInCurrentVisit.forEach((fromCurrent) => {
    rowsFromPreviousVisits.forEach((fromPrev, i, arr) => {
      if (rowIntervalOverlapping(fromPrev, fromCurrent)) {
        fromPrev.endDate = sub(fromCurrent.startDate!, { days: 1 });
        // fromPrev.Dates = `${format(fromPrev.startDate, 'MM/dd/yyyy')} - ${format(fromPrev.endDate, 'MM/dd/yyyy')}`;
        fromPrev.intervalUnit = 'Days';
        fromPrev.intervalCount = differenceInCalendarDays(fromPrev.endDate, fromPrev.startDate!) + 1;
        fromPrev.prescription = prescription({
          form: fromPrev.form,
          intervalCount: fromPrev.intervalCount,
          intervalUnit: fromPrev.intervalUnit,
        },
        fromPrev.unitDosages!);

        if (isBefore(fromPrev.endDate, fromPrev.startDate!)) {
          arr.splice(i, 1);
        }
      }

      if (rowIntervalIsAfter(fromPrev, fromCurrent)) {
        arr.splice(i, 1);
      }
    });
  });

  return [...rowsFromPreviousVisits, ...rowsAddedInCurrentVisit];
};

const sort = (drugNames: string[], rows: TableRowData[]): TableRowData[] => {
  const compare = (a: TableRowData, b: TableRowData) => {
    if (isBefore(a.startDate!, b.startDate!)) {
      return -1;
    }

    if (a.startDate === b.startDate) {
      return 1;
    }

    const compareDrugNames = drugNames
      .findIndex((drug) => drug === a.drug) < drugNames.findIndex((drug) => drug === b.drug);

    if (compareDrugNames) {
      return -1;
    }
    return 1;
  };

  return rows.sort(compare);
};

export const scheduleGenerator = (prescribedDrugs: PrescribedDrug[]): Schedule => {
  console.group('scheduleGenerator');
  console.log('prescribedDrugs: ', prescribedDrugs);
  const drugNames = prescribedDrugs.map((drug) => drug.name);

  const converted: Converted[] = convert(prescribedDrugs);
  console.log('converted: ', converted);
  const rows: TableRowData[] = generateTableRows(converted);
  console.log('rows: ', rows);
  const intervalOverlapCheckedRows: TableRowData[] = checkIntervalOverlappingRows(rows);
  console.log('intervalOverlapCheckedRows: ', intervalOverlapCheckedRows);
  const tableDataSorted: TableRowData[] = sort(drugNames, intervalOverlapCheckedRows);
  console.log('tableData: ', tableDataSorted);
  tableDataSorted.unshift(...prescribedDrugs.map((drug) => ({
    prescribedDrugId: drug.id,
    isPriorDosage: true,
    drug: drug.name,
    brand: drug.brand,
    dosage: drug.priorDosages.reduce((prev, { dosage, quantity }) => {
      return prev + parseFloat(dosage) * quantity;
    }, 0),
    prescription: null,
    startDate: null,
    endDate: null,
    selected: false,
    availableDosageOptions: [],
    regularDosageOptions: null,
    unitDosages: {},
    addedInCurrentVisit: false,
    intervalDurationDays: -1,
    intervalCount: -1,
    intervalUnit: null,
    measureUnit: drug.measureUnit,
    form: drug.form,
  })) as TableRowData[]);
  console.groupEnd();

  return { data: tableDataSorted, drugs: prescribedDrugs };
};

export type ScheduleChartData = { name: string, changeDirection: 'increase' | 'decrease' | 'same', data: { timestamp: number, dosage: number }[] }[];

export const chartDataConverter = (schedule: Schedule): ScheduleChartData => {
  const rowsGroupByDrug: { [drug: string]: TableRowData[] } = {};

  const scheduleChartData: ScheduleChartData = [];

  schedule.drugs.forEach((drug) => {
    rowsGroupByDrug[drug.name] = [];
  });

  schedule.data
    .filter((row) => !row.isPriorDosage)
    .forEach((row) => {
      rowsGroupByDrug[row.drug].push(row);
    });

  const changeDirections: { [drugName: string]: 'increase'|'decrease'|'same' } = schedule.drugs.reduce((prev, drug) => {
    const priorDosageSum = drug.priorDosages.reduce((acc, { dosage, quantity }) => {
      return acc + parseFloat(dosage) * quantity;
    }, 0);

    const upcomingDosageSum = drug.upcomingDosages.reduce((acc, { dosage, quantity }) => {
      return acc + parseFloat(dosage) * quantity;
    }, 0);

    if (priorDosageSum > upcomingDosageSum) {
      prev[drug.name] = 'decrease';
    } else if (priorDosageSum < upcomingDosageSum) {
      prev[drug.name] = 'increase';
    } else {
      prev[drug.name] = 'same';
    }

    return prev;
  }, {} as { [drugName: string]: 'increase'|'decrease'|'same' });

  Object.entries(rowsGroupByDrug).forEach(([k, rows]) => {
    scheduleChartData.push({ name: k, changeDirection: changeDirections[k], data: [] });
    rows.forEach((row, i) => {
      const chartData = scheduleChartData.find((el) => el.name === k)!;
      Array(differenceInCalendarDays(row.endDate!, row.startDate!) + 1).fill(null).forEach((_, j) => {
        chartData.data.push({
          timestamp: add(row.startDate!, { days: j }).getTime(),
          dosage: row.dosage,
        });
      });

      if (i === rows.length - 1) {
        chartData.data.push({
          timestamp: row.endDate!.getTime(),
          dosage: row.dosage,
        });
      }
    });
  });

  return scheduleChartData;
};

export const generateInstructionsForPatientFromSchedule = (schedule: Schedule): string => {
  return schedule.data
    .filter((row) => row.selected && !row.isPriorDosage)
    .reduce((message, row) => {
      const startDate = format(row.startDate!, 'MMM dd, yyyy');
      const endDate = format(row.endDate!, 'MMM dd, yyyy');
      const dosagesPrescribed = row.prescription!.replace(/ for.+/, '');
      return `${message}Take ${row.drug}(${row.brand}) ${dosagesPrescribed} from ${startDate} to ${endDate}.\n`;
    }, '');
};

export const generateInstructionsForPharmacy = (patientInstructions: string, prescription: Prescription): string => {
  const instructionsForPatients = `Instructions for Patient:
  ${patientInstructions
    .split('\n')
    .filter((instruction) => instruction !== '')
    .reduce((prev, line, i, instructionsArr) => {
      if (i === instructionsArr.length - 1) {
        return `${prev}\t${line}`;
      }
      return `${prev}\t${line}\n`;
    }, '')}\n---------------------------------------------------\n`;

  return Object.values(prescription).reduce((instruction, { name, brand, dosageQty }, i, prescriptionArr) => {
    const dosages = Object.entries(dosageQty).reduce((acc, [dos, qty], j, dosageArr) => {
      if (j === dosageArr.length - 1) {
        return `${acc}${qty} * ${dos}`;
      }
      return `${acc}${qty} * ${dos}, `;
    }, '');

    return `${instruction}${name}(${brand}): ${dosages}\n`;
  }, instructionsForPatients);
};

export const calcFinalPrescription = (scheduleData: TableRowData[], tableSelectedRows: (number | null)[]): Prescription => {
  const finalPrescription = scheduleData
    .filter((row, i) => tableSelectedRows.includes(i))
    .reduce((prev, row) => {
      if (!prev[row.prescribedDrugId]) {
        const obj: ValueOf<Prescription> = {
          name: '', brand: '', form: '', availableDosages: [], oralDosageInfo: null, dosageQty: {},
        };
        obj.name = row.drug;
        obj.brand = row.brand;
        obj.form = row.form;
        if (row.oralDosageInfo) {
          obj.oralDosageInfo = row.oralDosageInfo;
        }
        obj.availableDosages = row.availableDosageOptions!;
        obj.dosageQty = Object.entries(row.unitDosages!)
          .reduce((dosages, [dosage, qty]) => {
            if (!dosages[dosage]) {
              dosages[dosage] = qty * row.intervalDurationDays!;
            } else {
              dosages[dosage] += qty * row.intervalDurationDays!;
            }
            return dosages;
          }, {} as { [dosage: string]: number });
        prev[row.prescribedDrugId] = obj;
      } else {
        Object.entries(row.unitDosages!)
          .forEach(([dosage, qty]) => {
            if (!prev[row.prescribedDrugId].dosageQty[dosage]) {
              prev[row.prescribedDrugId].dosageQty[dosage] = qty * row.intervalDurationDays!;
            } else {
              prev[row.prescribedDrugId].dosageQty[dosage] += qty * row.intervalDurationDays!;
            }
          });
      }
      return prev;
    }, {} as Prescription);

  Object.entries(finalPrescription).forEach(([id, prescription]) => {
    if (prescription.oralDosageInfo) {
      const dosageInMl = prescription.dosageQty['1mg'] / prescription.oralDosageInfo.rate.mg * prescription.oralDosageInfo.rate.ml;
      prescription.dosageQty = calcMinimumQuantityForDosage(prescription.oralDosageInfo.bottles, dosageInMl, null);
    }
  });
  return finalPrescription;
};
