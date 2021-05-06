import {
  add, differenceInCalendarDays, format, isAfter, isBefore,
} from 'date-fns';
import { PrescribedDrug } from '../../types';
import { TableRow } from '../../components/ProjectedScheduleTable';
import { Schedule } from '../../components/ProjectedSchedule';

interface Converted {
  name: string,
  brand: string,
  currentDosageSum: number,
  nextDosageSum: number,
  // dates: { start: Date, end: Date },
  changeRate: number,
  changeAmount: number,
  // duration: { [key in 'days' | 'weeks' | 'months']?: number },
  dosageUnit: RegExpMatchArray,
  minDosageUnit: number,
  isIncreasing: boolean,
  // endIntervalsDate: Date
}
const validate = (drugs: PrescribedDrug[]): PrescribedDrug[] | null => {
  for (const drug of drugs) {
    Object.entries(drug).forEach(([k, v]) => {
      if (v === null) {
        alert(`Please check ${k} of ${drug.name}.`);
        return null;
      }
    });
  }
  return drugs;
};

const convert = (drugs: PrescribedDrug[]): Converted[] => {
  return drugs.map((drug) => {
    const currentDosageSum = drug.currentDosages
      .reduce((acc, d) => acc + parseInt(d.dosage, 10) * d.quantity, 0);
    const nextDosageSum = drug.nextDosages
      .reduce((acc, d) => acc + parseInt(d.dosage, 10) * d.quantity, 0);
    const dosageUnit = drug.currentDosages[0].dosage.match(/[a-z]+/)!;
    const isIncreasing = currentDosageSum < nextDosageSum;

    return {
      name: drug.name,
      brand: drug.brand,
      currentDosageSum,
      nextDosageSum,
      changeAmount: nextDosageSum - currentDosageSum,
      changeRate: nextDosageSum / currentDosageSum,
      dosageUnit,
      isIncreasing,
      minDosageUnit: drug.minDosageUnit,
    };
  });
};

const ceil = (minDosage: number, dosage: number): number => {
  console.log('minDosage: ', minDosage, 'dosage: ', dosage);
  if (dosage % minDosage === 0) {
    console.log('dosage % minDosage === 0');
    return dosage;
  }

  if (dosage < minDosage) {
    console.log('dosage < minDosage');
    return 0;
  }

  console.log('dosage > minDosage');
  let floor = Math.floor(dosage / minDosage) * minDosage;
  const ceiling = Math.ceil(dosage / minDosage) * minDosage;
  if (floor === ceiling) {
    floor -= minDosage;
    if (floor < 0) {
      floor = 0;
    }
  }
  console.log('floor: ', floor, 'ceiling: ', ceiling);
  const res = ceiling === dosage ? floor : ceiling;
  console.log('res: ', res);
  return res;
};

const calcNextDosage = (drug: Converted, dosage: number): number => {
  // increasing - change by amount
  if (drug.isIncreasing) {
    return dosage + drug.changeAmount;
  }
  // decreasing - change by rate
  return ceil(drug.minDosageUnit, dosage * drug.changeRate);
};

const generateTableRows = (drugs: Converted[], intervalStartDate: Date, intervalEndDate: Date): (TableRow & { startDate: Date, endDate: Date })[] => {
  const rows: (TableRow & { startDate: Date, endDate: Date })[] = [];
  const durationInDays = { days: differenceInCalendarDays(intervalEndDate, intervalStartDate) };

  drugs.forEach((drug) => {
    rows.push({
      // Drug: drug.brand,
      Drug: drug.name,
      'Current Dosage': `${drug.currentDosageSum}${drug.dosageUnit}`,
      'Next Dosage': `${drug.nextDosageSum}${drug.dosageUnit}`,
      Dates: `${format(intervalStartDate, 'MM/dd/yyyy')} - ${format(intervalEndDate, 'MM/dd/yyyy')}`,
      startDate: intervalStartDate,
      endDate: intervalEndDate,
    });

    const projectionStartDate = add(intervalEndDate, { days: 1 });

    const newRowData = {
      // Drug: drug.brand,
      Drug: drug.name,
      currentDosageSum: drug.nextDosageSum,
      // nextDosageSum: drug.nextDosageSum * drug.changeRate,
      nextDosageSum: calcNextDosage(drug, drug.nextDosageSum),
      startDate: projectionStartDate,
      endDate: add(projectionStartDate, durationInDays),
    };

    Array(3).fill(null).forEach(() => {
      rows.push({
        // Drug: drug.brand,
        Drug: drug.name,
        'Current Dosage': `${newRowData.currentDosageSum}${drug.dosageUnit}`,
        'Next Dosage': `${newRowData.nextDosageSum}${drug.dosageUnit}`,
        Dates: `${format(newRowData.startDate, 'MM/dd/yyyy')} - ${format(newRowData.endDate, 'MM/dd/yyyy')}`,
        startDate: newRowData.startDate,
        endDate: newRowData.endDate,
      });

      newRowData.currentDosageSum = newRowData.nextDosageSum;
      newRowData.nextDosageSum = calcNextDosage(drug, newRowData.nextDosageSum);
      newRowData.startDate = add(newRowData.endDate, { days: 1 });
      newRowData.endDate = add(newRowData.startDate, durationInDays);
    });
  });
  return rows;
};

const sort = (drugNames: string[], rows: (TableRow & { startDate: Date, endDate: Date })[]): (TableRow & { startDate: Date, endDate: Date })[] => {
  const compare = (a: TableRow & { startDate: Date }, b: TableRow & { startDate: Date }) => {
    if (isBefore(a.startDate, b.startDate)) {
      return -1;
    } if (a.startDate === b.startDate) {
      return 1;
    }

    const compareDrugNames = drugNames
      .findIndex((drug) => drug === a.Drug) < drugNames.findIndex((drug) => drug === b.Drug);

    if (compareDrugNames) {
      return -1;
    }
    return 1;
  };

  return rows.sort(compare).map((row) => ({
    Drug: row.Drug,
    'Current Dosage': row['Current Dosage'],
    'Next Dosage': row['Next Dosage'],
    Dates: row.Dates,
    startDate: row.startDate,
    endDate: row.endDate,
  }));
};

const scheduleGenerator = (prescribedDrugs: PrescribedDrug[], intervalStartDate: Date, intervalEndDate: Date): Schedule => {
  if (!validate(prescribedDrugs)) {
    return {
      data: [], drugs: [],
    };
  }

  const drugNames = prescribedDrugs.map((drug) => drug.name);

  const converted: Converted[] = convert(prescribedDrugs);

  const rows: (TableRow & { startDate: Date, endDate: Date })[] = generateTableRows(converted, intervalStartDate, intervalEndDate);

  const tableData: (TableRow & { startDate: Date, endDate: Date })[] = sort(drugNames, rows);

  const schedule: Schedule = { data: tableData, drugs: drugNames };

  return schedule;
};

export type ScheduleChartData = { name: string, data: { time: string, dosage: number }[] }[];

const chartDataConverter = (schedule: Schedule): ScheduleChartData => {
  const groupByDrug: ScheduleChartData = [];
  schedule.drugs.forEach((drug) => {
    groupByDrug.push({ name: drug, data: [] as { time: string, dosage: number }[] });
  });

  schedule.data.forEach((row, i) => {
    groupByDrug
      .find((drug) => drug.name === row.Drug)!
      .data.push({ time: format(row.startDate, 'MM-dd'), dosage: parseInt(row['Current Dosage'], 10) });

    if (i === schedule.data.length - 1) {
      groupByDrug.find((drug) => drug.name === row.Drug)!
        .data.push({ time: format(row.endDate, 'MM-dd'), dosage: parseInt(row['Next Dosage'], 10) });
    }
  });

  return groupByDrug;
};

const messageGenerator = (drugs: PrescribedDrug[], intervalStartDate: Date, intervalEndDate: Date): string => {
  return drugs.reduce(
    (message, drug, drugIdx, arr) => {
      const dosages = drug.nextDosages.reduce(
        (str, dosage, dosageIdx, nextDosageArr) => {
          if (nextDosageArr.length === 1) {
            return `${dosage.dosage} ${drug.form}`;
          }
          if (dosageIdx === nextDosageArr.length - 1) {
            return `${str} and ${dosage.dosage} ${drug.form}`;
          }
          return `${str}, ${dosage.dosage} ${drug.form}`;
        }, '',
      );

      const endDate = format(intervalEndDate, 'MMM dd, yyyy');
      if (arr.length === 1) {
        return `${message} ${dosages} of ${drug.brand} until ${endDate}.`;
      }

      if (drugIdx === arr.length - 1) {
        return `${message} and ${dosages} of ${drug.brand} until ${endDate}.`;
      }

      return `${message} ${dosages} of ${drug.brand}`;
    }, 'Take',
  );
};

export { scheduleGenerator, chartDataConverter, messageGenerator };
