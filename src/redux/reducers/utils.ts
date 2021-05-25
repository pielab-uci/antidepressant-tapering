import {
  add, areIntervalsOverlapping, differenceInCalendarDays, format, isAfter, isBefore, sub,
} from 'date-fns';
import { OralDosage, PrescribedDrug } from '../../types';
import { TableRow } from '../../components/Schedule/ProjectedScheduleTable';
import { Schedule } from '../../components/Schedule/ProjectedSchedule';

interface Converted extends PrescribedDrug {
  intervalEndDate: Date;
  priorDosageSum: number;
  upcomingDosageSum: number;
  changeRate: number;
  changeAmount: number;
  isIncreasing: boolean;
}

export type TableRowData =
  TableRow & {
    startDate: Date,
    endDate: Date,
    selected: boolean,
    prescribedDosages: { [dosage: string]: number },
    addedInCurrentVisit: boolean,
    intervalCount: number,
    intervalUnit: 'Days'|'Weeks'|'Months',
    oralDosageInfo?: OralDosage,
    form: string };

export const isCompleteDrugInput = (drug: PrescribedDrug) => drug.name !== ''
  && drug.brand !== ''
  && drug.form !== ''
  && drug.intervalEndDate !== null
  && drug.intervalCount !== 0
  && drug.upcomingDosages.length !== 0;

export const completePrescribedDrugs = (drugs: PrescribedDrug[]|null|undefined): PrescribedDrug[] | [] => {
  return drugs ? drugs.filter((drug) => isCompleteDrugInput(drug)) : [];
};

export const validateCompleteInputs = (drugs: PrescribedDrug[]|null|undefined): boolean => {
  return !(drugs === null || drugs === undefined) && drugs
    .map((drug) => isCompleteDrugInput(drug))
    .every((cond) => cond);
};

const rowIntervalOverlapping = (prev: TableRowData, current: TableRowData) => {
  return prev.Drug === current.Drug
    && (areIntervalsOverlapping(
      { start: prev.startDate, end: prev.endDate },
      { start: current.startDate, end: current.endDate },
      { inclusive: true },
    ));
};

const rowIntervalIsAfter = (fromPrev: TableRowData, fromCurrent: TableRowData) => {
  return fromPrev.Drug === fromCurrent.Drug
    && isAfter(fromPrev.startDate, fromCurrent.endDate);
};

const convert = (drugs: PrescribedDrug[]): Converted[] => {
  return drugs.map((drug) => {
    const priorDosageSum = drug.priorDosages
      .reduce((acc, d) => acc + parseFloat(d.dosage) * d.quantity, 0);
    const upcomingDosageSum = drug.upcomingDosages
      .reduce((acc, d) => acc + parseFloat(d.dosage) * d.quantity, 0);
    const isIncreasing = priorDosageSum < upcomingDosageSum;

    return {
      ...drug,
      priorDosageSum,
      upcomingDosageSum,
      changeAmount: upcomingDosageSum - priorDosageSum,
      changeRate: upcomingDosageSum / priorDosageSum,
      intervalEndDate: drug.intervalEndDate!,
      isIncreasing,
    };
  });
};

const calcProjectedDosages = (drug: Converted, prescribedDosage: number, length: number): number[] => {
  const res: number[] = [];
  res.push(prescribedDosage);

  // increasing
  if (drug.isIncreasing) {
    Array(length - 1).fill(null).forEach((_, i) => {
      res.push(res[i] + drug.changeAmount);
    });
  } else {
    // decreasing
    const minDosage = parseFloat(drug.availableDosageOptions[0]);
    Array(length - 1).fill(null).forEach((_, i) => {
    // Array(length).fill(null).forEach((_, i) => {
      const nextTemp = drug.changeRate * res[i];
      const remainder = nextTemp % minDosage;

      if (remainder === 0) {
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

export const calcMinimumQuantityForDosage = (availableOptions: string[], dosage: number): { [dosageQty: string]: number } => {
  if (dosage === 0) {
    return availableOptions.reduce((prev: { [p: string]: number }, option) => {
      prev[option] = 0;
      return prev;
    }, {});
  }
  const dosages: { [dosage: string]: number } = {};

  let d = dosage;
  availableOptions
    .concat()
    .sort((a, b) => parseFloat(b) - parseFloat(a))
    .forEach((dos) => {
      const quot = Math.floor(d / parseFloat(dos));
      if (quot >= 1) {
        dosages[dos] = quot;
        d -= quot * parseFloat(dos);
      }
    });

  if (Object.values(dosages).every((qty) => qty === 0)) {
    dosages[availableOptions[0]] = 1;
    d = 0;
  }

  if (d > 0) {
    dosages[availableOptions[0]] += 1;
  }

  return dosages;
};

type PrescriptionFunction = (args: { form: string, intervalCount: number, intervalUnit: 'Days'|'Weeks'|'Months', oralDosageInfo?: OralDosage | null }, dosageQty: { [dosage: string]:number }) => string;
const prescription: PrescriptionFunction = (
  {
    form, intervalCount, intervalUnit, oralDosageInfo,
  }, dosageQty,
) => Object.entries(dosageQty)
  .filter(([dosage, qty]) => qty !== 0)
  .reduce((res, [dosage, qty], i, arr) => {
    if (i === arr.length - 1) {
      return `${res} ${qty}mg ${form} for ${intervalCount} ${intervalUnit.toLowerCase()}`;
    }

    if (oralDosageInfo) {
      return `${res} ${dosage} (${qty / oralDosageInfo.rate.mg * oralDosageInfo.rate.ml}ml) ${form} for ${intervalCount} ${intervalUnit.toLowerCase()}`;
    }

    return `${res} ${qty} * ${dosage} ${form}, `;
  }, '');

const generateTableRows = (drugs: Converted[]): TableRowData[] => {
  const rows: TableRowData[] = [];
  drugs.forEach((drug) => {
    const durationInDaysCount = { days: differenceInCalendarDays(drug.intervalEndDate, drug.intervalStartDate) + 1 };

    const upcomingDosages = calcProjectedDosages(drug, drug.upcomingDosageSum, 4);

    rows.push({
      Drug: drug.name,
      Dosage: `${upcomingDosages[0]}${drug.measureUnit}`,
      Dates: `${format(drug.intervalStartDate, 'MM/dd/yyyy')} - ${format(drug.intervalEndDate, 'MM/dd/yyyy')}`,
      startDate: drug.intervalStartDate,
      endDate: drug.intervalEndDate,
      Prescription: prescription({ ...drug }, drug.upcomingDosages.reduce(
        (prev, d) => ({ ...prev, [d.dosage]: d.quantity }), {},
      )),
      prescribedDosages: drug.prescribedDosages,
      addedInCurrentVisit: !drug.prevVisit,
      selected: !drug.prevVisit,
      form: drug.form,
      intervalCount: drug.intervalCount,
      intervalUnit: drug.intervalUnit,
      oralDosageInfo: drug.oralDosageInfo ? drug.oralDosageInfo : undefined,
    });

    const projectionStartDate = add(drug.intervalEndDate, { days: 1 });
    const newEndDate = sub(add(projectionStartDate, durationInDaysCount), { days: 1 });
    const newRowData = {
      Drug: drug.name,
      upcomingDosageSum: upcomingDosages[1],
      prescribedDosages: calcMinimumQuantityForDosage(drug.availableDosageOptions, upcomingDosages[1]),
      startDate: projectionStartDate,
      endDate: newEndDate,
      selected: false,
      form: drug.form,
      Prescription: '',
      intervalCount: drug.intervalCount,
      intervalUnit: drug.intervalUnit,
      oralDosageInfo: drug.oralDosageInfo ? drug.oralDosageInfo : undefined,
    };

    Array(3).fill(null).forEach((_, i) => {
      if (newRowData.upcomingDosageSum !== 0) {
        rows.push({
          Drug: drug.name,
          Dosage: `${newRowData.upcomingDosageSum}${drug.measureUnit}`,
          Dates: `${format(newRowData.startDate, 'MM/dd/yyyy')} - ${format(newRowData.endDate, 'MM/dd/yyyy')}`,
          startDate: newRowData.startDate,
          endDate: newRowData.endDate,
          Prescription: prescription({ ...drug }, newRowData.prescribedDosages),
          selected: false,
          addedInCurrentVisit: !drug.prevVisit,
          prescribedDosages: newRowData.prescribedDosages,
          intervalCount: drug.intervalCount,
          intervalUnit: drug.intervalUnit,
          form: drug.form,
          oralDosageInfo: drug.oralDosageInfo ? drug.oralDosageInfo : undefined,
        });

        newRowData.upcomingDosageSum = upcomingDosages[i + 2];
        newRowData.prescribedDosages = calcMinimumQuantityForDosage(drug.availableDosageOptions, newRowData.upcomingDosageSum);
        newRowData.startDate = add(newRowData.endDate, { days: 1 });
        newRowData.endDate = sub(add(newRowData.startDate, durationInDaysCount), { days: 1 });
      }
    });
  });

  return rows;
};

const checkIntervalOverlappingRows = (rows: TableRowData[]): TableRowData[] => {
  const rowsAddedInCurrentVisit = rows.filter((row) => row.addedInCurrentVisit);
  const rowsFromPreviousVisits = rows.filter((row) => !row.addedInCurrentVisit);

  rowsAddedInCurrentVisit.forEach((fromCurrent) => {
    rowsFromPreviousVisits.forEach((fromPrev, i, arr) => {
      if (rowIntervalOverlapping(fromPrev, fromCurrent)) {
        fromPrev.endDate = sub(fromCurrent.startDate, { days: 1 });
        fromPrev.Dates = `${format(fromPrev.startDate, 'MM/dd/yyyy')} - ${format(fromPrev.endDate, 'MM/dd/yyyy')}`;
        fromPrev.intervalUnit = 'Days';
        fromPrev.intervalCount = differenceInCalendarDays(fromPrev.endDate, fromPrev.startDate) + 1;
        fromPrev.Prescription = prescription({ form: fromPrev.form, intervalCount: fromPrev.intervalCount, intervalUnit: fromPrev.intervalUnit }, fromPrev.prescribedDosages);

        if (isBefore(fromPrev.endDate, fromPrev.startDate)) {
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

const sort = (drugNames: string[], rows:TableRowData[]): TableRowData[] => {
  const compare = (a: TableRow & { startDate: Date }, b: TableRow & { startDate: Date }) => {
    if (isBefore(a.startDate, b.startDate)) {
      return -1;
    }

    if (a.startDate === b.startDate) {
      return 1;
    }

    const compareDrugNames = drugNames
      .findIndex((drug) => drug === a.Drug) < drugNames.findIndex((drug) => drug === b.Drug);

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
  const tableDataSorted : TableRowData[] = sort(drugNames, intervalOverlapCheckedRows);
  console.log('tableData: ', tableDataSorted);

  console.groupEnd();

  return { data: tableDataSorted, drugs: drugNames };
};

export type ScheduleChartData = { name: string, data: { timestamp: number, dosage: number }[] }[];

export const chartDataConverter = (schedule: Schedule): ScheduleChartData => {
  const rowsGroupByDrug: { [drug: string]: (TableRow & { startDate: Date; endDate: Date })[] } = {};

  schedule.drugs.forEach((drug) => {
    rowsGroupByDrug[drug] = [];
  });

  schedule.data.forEach((row) => {
    rowsGroupByDrug[row.Drug].push(row);
  });

  const scheduleChartData: ScheduleChartData = [];

  Object.entries(rowsGroupByDrug).forEach(([k, rows]) => {
    scheduleChartData.push({ name: k, data: [] });
    rows.forEach((row, i) => {
      const chartData = scheduleChartData.find((el) => el.name === k)!;
      Array(differenceInCalendarDays(row.endDate, row.startDate) + 1).fill(null).forEach((_, j) => {
        chartData.data.push({
          timestamp: add(row.startDate, { days: j }).getTime(),
          dosage: parseFloat(row.Dosage),
        });
      });

      if (i === rows.length - 1) {
        chartData.data.push({
          timestamp: row.endDate.getTime(),
          dosage: parseFloat(row.Dosage),
        });
      }
    });
  });

  return scheduleChartData;
};

export const messageGenerateFromSchedule = (schedule: Schedule): string => {
  return schedule.data
    .filter((row) => row.selected)
    .reduce((message, row, i, arr) => {
      const startDate = format(row.startDate, 'MMM dd, yyyy');
      const endDate = format(row.endDate, 'MMM dd, yyyy');
      if (row.form === 'capsule' || row.form === 'tablet') {
        const dosages = Object.entries(row.prescribedDosages)
          .reduce(
            (prev, [dosage, qty], dosage_idx, dosages) => {
              if (qty === 0) {
                return prev;
              }
              if (dosage_idx === 0) {
                return `${prev} ${qty} ${dosage} ${row.form}(s)`;
              }
              if (dosage_idx === dosages.length - 1) {
                return `${prev} and ${qty} ${dosage} ${row.form}(s)`;
              }
              return `${prev}, ${qty} ${dosage} ${row.form}(s)`;
            },
            'Take',
          );
        return `${message} ${dosages} of ${row.Drug} from ${startDate} to ${endDate}.\n`;
      }

      // in case of oral solution/suspension
      return `Take ${message} ${row.prescribedDosages['1mg']}mg of ${row.Drug} (${row.prescribedDosages['1mg'] / row.oralDosageInfo!.rate.mg * row.oralDosageInfo!.rate.ml}ml) from ${startDate} to ${endDate}.\n`;
    }, '');
};
