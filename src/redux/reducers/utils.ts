import add from 'date-fns/esm/add';
import areIntervalsOverlapping from 'date-fns/esm/areIntervalsOverlapping';
import differenceInCalendarDays from 'date-fns/esm/differenceInCalendarDays';
import format from 'date-fns/esm/format';
import isAfter from 'date-fns/esm/isAfter';
import isBefore from 'date-fns/esm/isBefore';
import sub from 'date-fns/esm/sub';

import {
  OralDosage, PrescribedDrug, TableRowData, Converted, Prescription, ValueOf,
} from '../../types';
import { Schedule } from '../../components/Schedule/ProjectedSchedule';

export const isCompleteDrugInput = (drug: PrescribedDrug) => {
  const priorDosageSum = drug.priorDosages.reduce((prev, { dosage, quantity }) => {
    return prev + parseFloat(dosage) * quantity;
  }, 0);

  const upcomingDosageSum = drug.upcomingDosages.reduce((prev, { dosage, quantity }) => {
    return prev + parseFloat(dosage) * quantity;
  }, 0);

  return drug.name !== ''
    && drug.brand !== ''
    && drug.form !== ''
    && drug.intervalEndDate !== null
    && drug.intervalCount !== 0
    && (
      (priorDosageSum < upcomingDosageSum && drug.targetDosage >= upcomingDosageSum)
      || (priorDosageSum > upcomingDosageSum && drug.targetDosage <= upcomingDosageSum)
      || (priorDosageSum === upcomingDosageSum && upcomingDosageSum === drug.targetDosage)
    )
    && drug.upcomingDosages.length !== 0
    && !drug.upcomingDosages.every((dosage) => dosage.quantity === 0);
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

export const convert = (drugs: PrescribedDrug[]): Converted[] => {
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
  console.group('calcProjectedDosages');
  console.log('drug: ', drug);
  console.log('prescribedDosage: ', prescribedDosage);
  console.log('length: ', length);
  console.groupEnd();

  const res: number[] = [];
  res.push(prescribedDosage);

  // increasing
  if (drug.changeDirection === 'increase') {
    // Array(length - 1).fill(null).forEach((_, i) => {
    Array(length).fill(null).forEach((_, i) => {
      if (res[i] + drug.changeAmount < drug.targetDosage!) {
        res.push(res[i] + drug.changeAmount);
      } else {
        res.push(drug.targetDosage!);
      }
    });
  } else {
    // decreasing
    const minDosage = parseFloat(drug.availableDosageOptions[0]);
    // Array(length - 1).fill(null).forEach((_, i) => {
    Array(length).fill(null).forEach((_, i) => {
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

interface PrescriptionFunction {
  (args: {
    form: string,
    intervalCount: number,
    intervalUnit: 'Days' | 'Weeks' | 'Months' | null,
    oralDosageInfo?: OralDosage | null
  },
    dosageQty: { [dosage: string]: number })
  : {
    message: string;
    data: {
      form: string,
      unit: string;
      intervalCount: number;
      intervalUnit: 'Days' | 'Weeks' | 'Months' | null;
      dosage: { [dosage: string]: number }
    }
  };
}

export const prescription: PrescriptionFunction = (
  {
    form, intervalCount, intervalUnit, oralDosageInfo,
  },
  dosageQty,
) => {
  console.log('oralDosageInfo: ', oralDosageInfo);
  const message = Object.entries(dosageQty)
    .filter(([dosage, qty]) => qty !== 0)
    .reduce((res, [dosage, qty], i, arr) => {
      if (oralDosageInfo) {
        return `${res} ${qty / oralDosageInfo.rate.mg * oralDosageInfo.rate.ml}ml ${form} for ${intervalCount} ${intervalUnit!.toLowerCase().replace('s', '(s')}`;
      }

      if (i === arr.length - 1) {
        return `${res} ${qty} X ${dosage} ${form} for ${intervalCount} ${intervalUnit!.toLowerCase().replace('s', '(s)')}`;
      }

      return `${res} ${qty} X ${dosage} ${form}, `;
    }, '');

  const data = {
    form,
    unit: oralDosageInfo !== null ? 'ml' : 'mg',
    dosage: dosageQty,
    intervalCount,
    intervalUnit,
  };

  return {
    message,
    data,
  };
};

const projectionLengthOfEachDrug = (drug: Converted): number => {
  if (drug.changeDirection === 'increase') {
    const increasingLength = drug.targetDosage! / drug.changeAmount;
    return Number.isInteger(increasingLength) ? increasingLength - 1 : Math.floor(increasingLength);
  }

  if (drug.changeDirection === 'decrease') {
    if (drug.targetDosage === drug.upcomingDosageSum) {
      return 0;
    }
    if (drug.targetDosage === 0) {
      return Math.floor(Math.log(drug.upcomingDosageSum) / Math.log(1 / drug.changeRate)) + 1;
    }

    return Math.floor(Math.log(drug.upcomingDosageSum) / Math.log(1 / drug.changeRate)) + 1;
    // return Math.floor(Math.log(drug.targetDosage / drug.upcomingDosageSum) / Math.log(drug.changeRate));
  }

  // when drug.changeDirection === 'same'
  return 0;
};

export const generateTableRows = (drugs: Converted[], startRowIndexInPrescribedDrug = 0): TableRowData[] => {
  // const lengthOfProjection = Math.max(...drugs.map(projectionLengthOfEachDrug));
  console.group('generateTableRows');
  const tableRowsByDrug = drugs.map((drug) => {
    const rows: TableRowData[] = [];
    const durationInDaysCount = { days: differenceInCalendarDays(drug.intervalEndDate, drug.intervalStartDate) + 1 };
    console.log('drug: ', drug);
    const lengthOfProjection: number = projectionLengthOfEachDrug(drug);
    console.log('lengthOfProjection: ', lengthOfProjection);
    const upcomingDosages: number[] = calcProjectedDosages(drug, drug.upcomingDosageSum, lengthOfProjection);

    // correct error in upcomingDosage caculation
    const upcomingDosagesNoRepetition = [...new Set(upcomingDosages)];
    console.log('upcomingDosages: ', upcomingDosages);
    console.log('upcomingDosagesNoRepetition: ', upcomingDosagesNoRepetition);
    rows.push({
      rowIndexInPrescribedDrug: startRowIndexInPrescribedDrug,
      prescribedDrugId: drug.id,
      prescribedDrug: drug,
      drug: drug.name,
      brand: drug.brand,
      // dosage: upcomingDosages[0],
      dosage: upcomingDosagesNoRepetition[0],
      changeDirection: drug.changeDirection,
      startDate: drug.intervalStartDate,
      endDate: drug.intervalEndDate,
      goalDosage: drug.targetDosage,
      prescription: prescription({ ...drug },
        drug.upcomingDosages.reduce((prev, d) => ({ ...prev, [d.dosage]: d.quantity }), {})),
      unitDosages: drug.upcomingDosages.reduce((prev, { dosage, quantity }) => {
        prev[dosage] = quantity;
        return prev;
      }, {} as { [dosage: string]: number }),
      addedInCurrentVisit: !drug.prevVisit,
      selected: true,
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
      // upcomingDosageSum: upcomingDosages[1],
      upcomingDosageSum: upcomingDosagesNoRepetition[1],
      // prescribedDosages: calcMinimumQuantityForDosage(drug.availableDosageOptions, upcomingDosages[1], drug.regularDosageOptions),
      // unitDosages: calcMinimumQuantityForDosage(drug.availableDosageOptions, upcomingDosages[1], drug.regularDosageOptions),
      unitDosages: calcMinimumQuantityForDosage(drug.availableDosageOptions, upcomingDosagesNoRepetition[1], drug.regularDosageOptions),
      startDate: projectionStartDate,
      endDate: newEndDate,
      selected: false,
      form: drug.form,
      Prescription: '',
      intervalCount: drug.intervalCount,
      intervalUnit: drug.intervalUnit,
      oralDosageInfo: drug.oralDosageInfo ? drug.oralDosageInfo : undefined,
    };

    // Array(lengthOfProjection).fill(null).forEach((_, i) => {
    Array(upcomingDosagesNoRepetition.length).fill(null).forEach((_, i) => {
      if (newRowData.upcomingDosageSum !== 0) {
        rows.push({
          rowIndexInPrescribedDrug: startRowIndexInPrescribedDrug + i + 1,
          prescribedDrug: drug,
          prescribedDrugId: drug.id,
          drug: drug.name,
          brand: drug.brand,
          dosage: newRowData.upcomingDosageSum,
          startDate: newRowData.startDate,
          endDate: newRowData.endDate,
          prescription: prescription({ ...drug }, newRowData.unitDosages),
          selected: false,
          goalDosage: drug.targetDosage,
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
          changeDirection: drug.changeDirection,
        });

        // newRowData.upcomingDosageSum = upcomingDosages[i + 2];
        newRowData.upcomingDosageSum = upcomingDosagesNoRepetition[i + 2];
        newRowData.unitDosages = calcMinimumQuantityForDosage(drug.availableDosageOptions, newRowData.upcomingDosageSum, drug.regularDosageOptions);
        newRowData.startDate = add(newRowData.endDate, { days: 1 });
        newRowData.endDate = sub(add(newRowData.startDate, durationInDaysCount), { days: 1 });
      }
    });
    return {
      drug: drug.name,
      lastEndDate: rows[rows.length - 1].endDate!,
      rows: rows.filter((row) => row.dosage !== undefined),
    };
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

  console.groupEnd();
  return tableRowsByDrug.flatMap((drug) => drug.rows);
};

export const checkIntervalOverlappingRows = (rows: TableRowData[]): TableRowData[] => {
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

export const sort = (drugNames: string[], rows: TableRowData[]): TableRowData[] => {
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
  const drugsToApplyInSchedule = prescribedDrugs.filter((drug) => drug.applyInSchedule);
  // const drugNames = prescribedDrugs.map((drug) => drug.name);
  const drugNames = drugsToApplyInSchedule.map((drug) => drug.name);

  // const converted: Converted[] = convert(prescribedDrugs);
  const converted: Converted[] = convert(drugsToApplyInSchedule);
  console.log('converted: ', converted);
  const rows: TableRowData[] = generateTableRows(converted);
  console.log('rows: ', rows);

  // TODO: reflect later for saving feature
  const intervalOverlapCheckedRows: TableRowData[] = checkIntervalOverlappingRows(rows);
  console.log('intervalOverlapCheckedRows: ', intervalOverlapCheckedRows);
  // const tableDataSorted: TableRowData[] = sort(drugNames, intervalOverlapCheckedRows);
  const tableDataSorted: TableRowData[] = sort(drugNames, rows);
  console.log('tableData: ', tableDataSorted);
  // tableDataSorted.unshift(...prescribedDrugs.map((drug) => ({
  // tableDataSorted.unshift(...drugsToApplyInSchedule
  tableDataSorted.unshift(...converted
    .filter((drug) => !drug.isModal)
    .map((drug) => ({
      rowIndexInPrescribedDrug: -1,
      prescribedDrugId: drug.id,
      changeDirection: drug.changeDirection,
      isPriorDosage: true,
      prescribedDrug: drug,
      drug: drug.name,
      brand: drug.brand,
      dosage: drug.priorDosages.reduce((prev, { dosage, quantity }) => {
        return prev + parseFloat(dosage) * quantity;
      }, 0),
      prescription: null,
      startDate: null,
      endDate: tableDataSorted[0].startDate,
      selected: false,
      availableDosageOptions: [],
      regularDosageOptions: null,
      unitDosages: {},
      addedInCurrentVisit: false,
      intervalDurationDays: -1,
      goalDosage: drug.targetDosage,
      intervalCount: -1,
      intervalUnit: null,
      measureUnit: drug.measureUnit,
      form: drug.form,
    })) as TableRowData[]);
  console.groupEnd();

  // return { data: tableDataSorted, drugs: prescribedDrugs };
  return { data: tableDataSorted, drugs: drugsToApplyInSchedule };
};

export type ScheduleChartData = { name: string, brand: string, changeDirection: 'increase' | 'decrease' | 'same', data: { timestamp: number, dosage: number }[] }[];

export const chartDataConverter = (schedule: Schedule): ScheduleChartData => {
  const rowsGroupByDrug: { [drugName_brand: string]: TableRowData[] } = {};

  const scheduleChartData: ScheduleChartData = [];

  schedule.drugs.forEach((drug) => {
    rowsGroupByDrug[`${drug.name}_${drug.brand}`] = [];
  });

  schedule.data
    .filter((row) => !row.isPriorDosage)
    .forEach((row) => {
      rowsGroupByDrug[`${row.drug}_${row.brand}`].push(row);
    });

  const changeDirections: { [drugName_brand: string]: 'increase' | 'decrease' | 'same' } = schedule.drugs.reduce((prev, drug) => {
    const priorDosageSum = drug.priorDosages.reduce((acc, { dosage, quantity }) => {
      return acc + parseFloat(dosage) * quantity;
    }, 0);

    const upcomingDosageSum = drug.upcomingDosages.reduce((acc, { dosage, quantity }) => {
      return acc + parseFloat(dosage) * quantity;
    }, 0);

    if (priorDosageSum > upcomingDosageSum) {
      prev[`${drug.name}_${drug.brand}`] = 'decrease';
    } else if (priorDosageSum < upcomingDosageSum) {
      prev[`${drug.name}_${drug.brand}`] = 'increase';
    } else {
      prev[`${drug.name}_${drug.brand}`] = 'same';
    }

    return prev;
  }, {} as { [drugName_brand: string]: 'increase' | 'decrease' | 'same' });

  Object.entries(rowsGroupByDrug).forEach(([k, rows]) => {
    const [drugName, drugBrand] = k.split('_');
    scheduleChartData.push({
      name: drugName, brand: drugBrand, changeDirection: changeDirections[k], data: [],
    });

    rows.forEach((row, i) => {
      const chartData = scheduleChartData.find((el) => el.brand === drugBrand)!;
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
  const rowsGroupByDrug: { [drug: string]: TableRowData[] } = schedule.data
  // .filter((row) => row.selected && !row.isPriorDosage)
    .reduce((acc, row) => {
      return Object.keys(acc).includes(row.drug)
        ? { ...acc, [row.drug]: [...acc[row.drug], row] }
        : { ...acc, [row.drug]: [] };
    }, {} as { [drug: string]: TableRowData[] });
  // const rowsGroupByDrug: { [drug: string]: TableRowData[] } = JSON.parse(
  //     JSON.stringify(
  //       schedule.data
  //         // .filter((row) => row.selected && !row.isPriorDosage)
  //         .reduce((acc, row) => {
  //           return Object.keys(acc).includes(row.drug)
  //             ? { ...acc, [row.drug]: [...acc[row.drug], row] }
  //             : { ...acc, [row.drug]: [] };
  //         }, {} as { [drug: string]: TableRowData[] }),
  //     ),
  //   );

  console.log('rowsGroupByDrug');
  console.log(rowsGroupByDrug);
  return Object.entries(rowsGroupByDrug)
    .map(([drug, rows]) => {
      const messageHeading = rows[0].changeDirection === 'decrease' ? `Reduce ${drug} to\n` : `Take ${drug}\n`;

      return rows
        .filter((row) => row.selected && !row.isPriorDosage)
        .reduce((message, row, j, rowArr) => {
          const rowPrescription = row.prescription!;
          const messageLine = Object.entries(rowPrescription.data.dosage)
            .reduce((prev, [dosage, qty], i, arr) => {
              if (i === arr.length - 1) {
                if (j === rowArr.length - 1) {
                  return `${prev} ${dosage} ${rowPrescription.data.form}s, ${qty} ${rowPrescription.data.form} daily for ${rowPrescription.data.intervalCount} ${rowPrescription.data.intervalUnit?.toLowerCase().replace('s', '(s)')}, then STOP.\n`;
                }
                return `${prev} ${dosage} ${rowPrescription.data.form}s, ${qty} ${rowPrescription.data.form} daily for ${rowPrescription.data.intervalCount} ${rowPrescription.data.intervalUnit} then,\n`;
              }
              return `${prev} ${dosage} ${rowPrescription.data.form}s, ${qty} ${rowPrescription.data.form} + `;
            }, '');
          return `${message}\t${messageLine}`;
        }, messageHeading);
    })
    .reduce((acc, message) => `${acc}${message}\n`, '');
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

  // return Object.values(prescription)
  const parsedPrescription: Prescription = JSON.parse(JSON.stringify(prescription));
  return Object.values(parsedPrescription)
    .reduce((instruction, { name, brand, dosageQty }, i, prescriptionArr) => {
      const dosages = Object
        .entries(dosageQty)
        .filter(([dos, qty]) => qty !== 0)
        .reduce((acc, [dos, qty], j, dosageArr) => {
          if (j === dosageArr.length - 1) {
            return `${acc}${qty} X ${dos}`;
          }
          return `${acc}${qty} X ${dos}, `;
        }, '');

      return `${instruction}${name} (${brand}): ${dosages}\n`;
    }, instructionsForPatients);
};

export const calcFinalPrescription = (scheduleData: TableRowData[], tableSelectedRows: (number | null)[]): Prescription => {
  const finalPrescription = scheduleData
    .filter((row, i) => tableSelectedRows.includes(i))
    .reduce((prev, row) => {
      if (!prev[row.prescribedDrugId]) {
        const obj: ValueOf<Prescription> = {
          name: '',
          brand: '',
          form: '',
          // availableDosages: [],
          regularDosageOptions: [],
          oralDosageInfo: null,
          dosageQty: {},
        };
        obj.name = row.drug;
        obj.brand = row.brand;
        obj.form = row.form;
        if (row.oralDosageInfo) {
          obj.oralDosageInfo = row.oralDosageInfo;
        }
        // obj.availableDosages = row.availableDosageOptions!;
        obj.regularDosageOptions = row.regularDosageOptions!;
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
