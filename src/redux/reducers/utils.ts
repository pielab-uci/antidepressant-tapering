import {
  add, differenceInCalendarDays, format, isBefore,
} from 'date-fns';
import { PrescribedDrug } from '../../types';
import { TableRow } from '../../components/ProjectedScheduleTable';
import { Schedule } from '../../components/ProjectedSchedule';

interface Converted extends PrescribedDrug {
  intervalEndDate: Date;
  currentDosageSum: number;
  nextDosageSum: number;
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
    form: string };

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
    const isIncreasing = currentDosageSum < nextDosageSum;

    return {
      ...drug,
      currentDosageSum,
      nextDosageSum,
      changeAmount: nextDosageSum - currentDosageSum,
      changeRate: nextDosageSum / currentDosageSum,
      intervalEndDate: drug.intervalEndDate!,
      isIncreasing,
    };
  });
};

const calcProjectedDosages = (drug: Converted, prescribedDosage: number, length: number): number[] => {
  console.group('calcProjectedDosages');
  console.log('length: ', length);
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
    console.log('minDosage: ', minDosage);
    Array(length - 1).fill(null).forEach((_, i) => {
    // Array(length).fill(null).forEach((_, i) => {
      console.group('idx: ', i);
      console.log('res: ', res);
      const nextTemp = drug.changeRate * res[i];
      const remainder = nextTemp % minDosage;
      console.log('nextTemp: ', nextTemp);

      if (remainder === 0) {
        console.log('remainder === 0');
        res.push(nextTemp);
      } else {
        console.log('remainder: ', remainder);
        const floor = Math.floor(nextTemp / minDosage) * minDosage;
        const ceiling = Math.ceil(nextTemp / minDosage) * minDosage;
        console.log('floor: ', floor, 'ceiling: ', ceiling);

        if (i === length - 2 && drug.form === 'tablet' && drug.allowSplittingUnscoredDosageUnit) {
          console.log('push ceiling - minDosage/2', ceiling - minDosage / 2);
          res.push(ceiling - minDosage / 2);
        } else if (ceiling === res[i]) {
          console.log('push floor', floor);
          res.push(floor);
        } else if (ceiling > nextTemp) {
          console.log('ceiling > nextTemp, push floor: ', floor);
          res.push(floor);
        } else {
          console.log('push ceiling: ', ceiling);
          res.push(ceiling);
        }
      }
      console.groupEnd();
    });
    console.log('res: ', res);
  }
  console.groupEnd();
  return res;
};

const calcNextDosageQty = (drug: Converted, dosage: number): { [dosageQty: string]: number } => {
  const nextDosageQty: { [dosage: string]: number } = {};
  console.group('calcNextDosageQty');
  console.log('availableDosageOptions: ', drug.availableDosageOptions);

  let d = dosage;
  drug.availableDosageOptions
    .concat()
    .sort((a, b) => parseFloat(b) - parseFloat(a))
    .forEach((dos) => {
      console.log('d: ', d);
      console.log('dos: ', dos);
      const quot = Math.floor(d / parseFloat(dos));
      console.log('quot: ', quot);
      if (quot >= 1) {
        nextDosageQty[dos] = quot;
        d -= quot * parseFloat(dos);
      }
    });

  // TODO: handle splitting case here..?
  if (d > 0) {
    console.error('error in calcNextDosageQty');
  }
  console.log('nextDosageQty: ', nextDosageQty);
  console.groupEnd();
  return nextDosageQty;
};

const generateTableRows = (drugs: Converted[]): TableRowData[] => {
  const rows: TableRowData[] = [];
  console.log('drugs: ', drugs);
  drugs.forEach((drug) => {
    const durationInDays = { days: differenceInCalendarDays(drug.intervalEndDate, drug.intervalStartDate) };
    const prescription = (dosageQty: { [dosage: string]: number }) => Object.entries(dosageQty)
      .reduce((res, [dosage, qty], i, arr) => {
        if (i === arr.length - 1) {
          return `${res} ${qty} * ${dosage} ${drug.form} for ${drug.intervalCount + 1} ${drug.intervalUnit.toLowerCase()}`;
        }
        return `${res} ${qty} * ${dosage} ${drug.form}, `;
        // return `${res} ${qty} * ${dosage} ${drug.form} * ${drug.intervalCount + 1} ${drug.intervalUnit.toLowerCase()}, `;
      }, '');

    const nextDosages = calcProjectedDosages(drug, drug.nextDosageSum, 4);

    rows.push({
      // Drug: drug.brand,
      Drug: drug.name,
      'Current Dosage': `${drug.currentDosageSum}${drug.measureUnit}`,
      'Next Dosage': `${nextDosages[0]}${drug.measureUnit}`,
      Dates: `${format(drug.intervalStartDate, 'MM/dd/yyyy')} - ${format(drug.intervalEndDate, 'MM/dd/yyyy')}`,
      startDate: drug.intervalStartDate,
      endDate: drug.intervalEndDate,
      Prescription: prescription(drug.prescribedDosages),
      prescribedDosages: drug.prescribedDosages,
      selected: true,
      form: drug.form,
    });

    const projectionStartDate = add(drug.intervalEndDate, { days: 1 });

    const newRowData = {
      // Drug: drug.brand,
      Drug: drug.name,
      currentDosageSum: drug.nextDosageSum,
      nextDosageSum: nextDosages[1],
      prescribedDosages: calcNextDosageQty(drug, nextDosages[1]),
      startDate: projectionStartDate,
      endDate: add(projectionStartDate, durationInDays),
      selected: false,
      form: drug.form,
      Prescription: '',
    };

    Array(3).fill(null).forEach((_, i) => {
      rows.push({
        // Drug: drug.brand,
        Drug: drug.name,
        'Current Dosage': `${newRowData.currentDosageSum}${drug.measureUnit}`,
        'Next Dosage': `${newRowData.nextDosageSum}${drug.measureUnit}`,
        Dates: `${format(newRowData.startDate, 'MM/dd/yyyy')} - ${format(newRowData.endDate, 'MM/dd/yyyy')}`,
        startDate: newRowData.startDate,
        endDate: newRowData.endDate,
        Prescription: prescription(newRowData.prescribedDosages),
        selected: false,
        prescribedDosages: newRowData.prescribedDosages,
        form: drug.form,
      });

      newRowData.currentDosageSum = newRowData.nextDosageSum;
      newRowData.nextDosageSum = nextDosages[i + 2];
      newRowData.prescribedDosages = calcNextDosageQty(drug, newRowData.nextDosageSum);
      newRowData.startDate = add(newRowData.endDate, { days: 1 });
      newRowData.endDate = add(newRowData.startDate, durationInDays);
    });
  });

  return rows;
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
  if (!validate(prescribedDrugs)) {
    return {
      data: [], drugs: [],
    };
  }

  const drugNames = prescribedDrugs.map((drug) => drug.name);
  // const drugNames = prescribedDrugs.map((drug) => drug.brand);
  const converted: Converted[] = convert(prescribedDrugs);
  console.log('converted: ', converted);
  const rows: TableRowData[] = generateTableRows(converted);
  console.log('rows: ', rows);
  const tableData: TableRowData[] = sort(drugNames, rows);
  console.log('tableData: ', tableData);
  const schedule: Schedule = { data: tableData, drugs: drugNames };
  console.log('schedule: ', schedule);
  console.groupEnd();
  return schedule;
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
      chartData.data.push({
        timestamp: row.startDate.getTime(),
        // dosage: parseFloat(row['Current Dosage']),
        dosage: parseFloat(row['Next Dosage']),
      });

      if (i === rows.length - 1) {
        chartData.data.push({
          timestamp: row.endDate.getTime(),
          dosage: parseFloat(row['Next Dosage']),
          // dosage: parseFloat(row['Current Dosage']),
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
      const dosages = Object.entries(row.prescribedDosages)
        .reduce(
          (prev, [dosage, qty]) => `${prev} ${qty} ${dosage} ${row.form}(s)`,
          'Take',
        );
      const startDate = format(row.startDate, 'MMM dd, yyyy');
      const endDate = format(row.endDate, 'MMM dd, yyyy');
      return `${message} ${dosages} of ${row.Drug} from ${startDate} to ${endDate}.\n`;
    }, '');
};
