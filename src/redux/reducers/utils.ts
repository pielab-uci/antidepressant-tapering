import {
  add, differenceInCalendarDays, format, isBefore,
} from 'date-fns';
import { PrescribedDrug } from '../../types';
import { TableRow } from '../../components/ProjectedScheduleTable';
import { Schedule } from '../../components/ProjectedSchedule';

type Converted = PrescribedDrug & {
  intervalEndDate: Date;
  priorDosageSum: number;
  upcomingDosageSum: number;
  changeRate: number;
  changeAmount: number;
  isIncreasing: boolean;
};

export type TableRowData =
  TableRow & {
    startDate: Date,
    endDate: Date,
    selected: boolean,
    prescribedDosages: { [dosage: string]: number },
    form: string };

export const validateCompleteInputs = (drugs: PrescribedDrug[]): boolean => {
  const isCompleteDrugInput = (drug: PrescribedDrug) => drug.name !== ''
    && drug.brand !== ''
    && drug.form !== ''
    && drug.intervalEndDate !== null
    && drug.intervalCount !== 0
    && drug.upcomingDosages.length !== 0;

  return drugs
    .map((drug) => isCompleteDrugInput(drug))
    .every((cond) => cond);
};

// const validate = (drugs: PrescribedDrug[]): PrescribedDrug[] | null => {
//   for (const drug of drugs) {
//     Object.entries(drug).forEach(([k, v]) => {
//       if (v === null) {
//         // alert(`Please check ${k} of ${drug.name}.`);
//         console.error(`Check ${k} of ${drug.name}.`);
//         return null;
//       }
//     });
//   }
//   return drugs;
// };

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

const calcNextDosageQty = (drug: Converted, dosage: number): { [dosageQty: string]: number } => {
  const upcomingDosageQty: { [dosage: string]: number } = {};

  let d = dosage;
  drug.availableDosageOptions
    .concat()
    .sort((a, b) => parseFloat(b) - parseFloat(a))
    .forEach((dos) => {
      const quot = Math.floor(d / parseFloat(dos));
      if (quot >= 1) {
        upcomingDosageQty[dos] = quot;
        d -= quot * parseFloat(dos);
      }
    });

  // TODO: handle splitting case here..?
  if (d > 0) {
    console.error('error in calcNextDosageQty');
  }
  return upcomingDosageQty;
};

const prescription = (drug: Converted, dosageQty: { [dosage: string]: number }) => Object.entries(dosageQty)
  .filter(([dosage, qty]) => qty !== 0)
  .reduce((res, [dosage, qty], i, arr) => {
    if (i === arr.length - 1) {
      return `${res} ${qty} * ${dosage} ${drug.form} for ${drug.intervalCount + 1} ${drug.intervalUnit.toLowerCase()}`;
    }

    return `${res} ${qty} * ${dosage} ${drug.form}, `;
  }, '');

const generateTableRows = (drugs: Converted[]): TableRowData[] => {
  const rows: TableRowData[] = [];
  drugs.forEach((drug) => {
    const durationInDays = { days: differenceInCalendarDays(drug.intervalEndDate, drug.intervalStartDate) };

    const upcomingDosages = calcProjectedDosages(drug, drug.upcomingDosageSum, 4);

    rows.push({
      // Drug: drug.brand,
      Drug: drug.name,
      Dosage: `${upcomingDosages[0]}${drug.measureUnit}`,
      Dates: `${format(drug.intervalStartDate, 'MM/dd/yyyy')} - ${format(drug.intervalEndDate, 'MM/dd/yyyy')}`,
      startDate: drug.intervalStartDate,
      endDate: drug.intervalEndDate,
      // Prescription: prescription(drug, drug.prescribedDosages),
      Prescription: prescription(drug, drug.upcomingDosages.reduce(
        (prev, d) => ({ ...prev, [d.dosage]: d.quantity }), {},
      )),
      prescribedDosages: drug.prescribedDosages,
      selected: true,
      form: drug.form,
    });

    const projectionStartDate = add(drug.intervalEndDate, { days: 1 });

    const newRowData = {
      // Drug: drug.brand,
      Drug: drug.name,
      upcomingDosageSum: upcomingDosages[1],
      prescribedDosages: calcNextDosageQty(drug, upcomingDosages[1]),
      startDate: projectionStartDate,
      endDate: add(projectionStartDate, durationInDays),
      selected: false,
      form: drug.form,
      Prescription: '',
    };

    Array(3).fill(null).forEach((_, i) => {
      // if (newRowData.priorDosageSum !== 0) {
      if (newRowData.upcomingDosageSum !== 0) {
        rows.push({
          // Drug: drug.brand,
          Drug: drug.name,
          Dosage: `${newRowData.upcomingDosageSum}${drug.measureUnit}`,
          Dates: `${format(newRowData.startDate, 'MM/dd/yyyy')} - ${format(newRowData.endDate, 'MM/dd/yyyy')}`,
          startDate: newRowData.startDate,
          endDate: newRowData.endDate,
          Prescription: prescription(drug, newRowData.prescribedDosages),
          selected: false,
          prescribedDosages: newRowData.prescribedDosages,
          form: drug.form,
        });

        newRowData.upcomingDosageSum = upcomingDosages[i + 2];
        newRowData.prescribedDosages = calcNextDosageQty(drug, newRowData.upcomingDosageSum);
        newRowData.startDate = add(newRowData.endDate, { days: 1 });
        newRowData.endDate = add(newRowData.startDate, durationInDays);
      }
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
  // if (!validate(prescribedDrugs)) {
  //   return {
  //     data: [], drugs: [],
  //   };
  // }

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
        dosage: parseFloat(row.Dosage),
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
      const dosages = Object.entries(row.prescribedDosages)
        .reduce(
          (prev, [dosage, qty], dosage_idx, dosages) => {
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
      const startDate = format(row.startDate, 'MMM dd, yyyy');
      const endDate = format(row.endDate, 'MMM dd, yyyy');
      return `${message} ${dosages} of ${row.Drug} from ${startDate} to ${endDate}.\n`;
    }, '');
};
