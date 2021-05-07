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
  intervalStartDate: Date,
  intervalEndDate: Date,
  intervalCount: number;
  intervalUnit: 'Days'|'Weeks'|'Months',
  changeRate: number,
  changeAmount: number,
  // duration: { [key in 'days' | 'weeks' | 'months']?: number },
  dosageUnit: RegExpMatchArray,
  minDosageUnit: number,
  isIncreasing: boolean,
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
      .reduce((acc, d) => acc + parseFloat(d.dosage) * d.quantity, 0);
    const nextDosageSum = drug.nextDosages
      .reduce((acc, d) => acc + parseFloat(d.dosage) * d.quantity, 0);
    const dosageUnit = drug.currentDosages[0].dosage.match(/[a-z]+/)!;
    const isIncreasing = currentDosageSum < nextDosageSum;

    return {
      name: drug.name,
      brand: drug.brand,
      currentDosageSum,
      nextDosageSum,
      changeAmount: nextDosageSum - currentDosageSum,
      changeRate: nextDosageSum / currentDosageSum,
      intervalStartDate: drug.intervalStartDate,
      intervalEndDate: drug.intervalEndDate!,
      intervalCount: drug.intervalCount,
      intervalUnit: drug.intervalUnit,
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

const generateTableRows = (drugs: Converted[]): (TableRow & { startDate: Date, endDate: Date })[] => {
  const rows: (TableRow & { startDate: Date, endDate: Date })[] = [];

  drugs.forEach((drug) => {
    const durationInDays = { days: differenceInCalendarDays(drug.intervalEndDate, drug.intervalStartDate) };
    rows.push({
      // Drug: drug.brand,
      Drug: drug.name,
      'Current Dosage': `${drug.currentDosageSum}${drug.dosageUnit}`,
      'Next Dosage': `${drug.nextDosageSum}${drug.dosageUnit}`,
      Dates: `${format(drug.intervalStartDate, 'MM/dd/yyyy')} - ${format(drug.intervalEndDate, 'MM/dd/yyyy')}`,
      startDate: drug.intervalStartDate,
      endDate: drug.intervalEndDate,
    });

    const projectionStartDate = add(drug.intervalEndDate, { days: 1 });

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

const scheduleGenerator = (prescribedDrugs: PrescribedDrug[]): Schedule => {
  if (!validate(prescribedDrugs)) {
    return {
      data: [], drugs: [],
    };
  }

  const drugNames = prescribedDrugs.map((drug) => drug.name);

  const converted: Converted[] = convert(prescribedDrugs);

  const rows: (TableRow & { startDate: Date, endDate: Date })[] = generateTableRows(converted);

  const tableData: (TableRow & { startDate: Date, endDate: Date })[] = sort(drugNames, rows);

  const schedule: Schedule = { data: tableData, drugs: drugNames };

  return schedule;
};

export type ScheduleChartData = { name: string, data: { time: string, dosage: number }[] }[];

const chartDataConverter = (schedule: Schedule): ScheduleChartData => {
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
      chartData.data.push({
        time: format(row.startDate, 'MM-dd'),
        dosage: parseFloat(row['Current Dosage']),
      });

      if (i === rows.length - 1) {
        chartData.data.push({
          time: format(row.endDate, 'MM-dd'),
          dosage: parseFloat(row['Next Dosage']),
        });
      }
    });
  });

  return scheduleChartData;
};

export { scheduleGenerator, chartDataConverter };