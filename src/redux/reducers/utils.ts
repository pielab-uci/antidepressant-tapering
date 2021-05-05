import {
  add, format, isAfter, isBefore,
} from 'date-fns';
import { PrescribedDrug } from '../../types';
import { TableRow } from '../../components/ProjectedScheduleTable';
import { Schedule } from '../../components/ProjectedSchedule';

interface Converted {
  name: string,
  currentDosageSum: number,
  nextDosageSum: number,
  dates: { start: Date, end: Date },
  changeRate: number,
  duration: { [key in 'days' | 'weeks' | 'months']?: number },
  dosageUnit: RegExpMatchArray,
  endIntervalsDate: Date
}

// TODO: endIntervalsDate -> simply intervalEndDate
const scheduleGenerator = (prescribedDrugs: PrescribedDrug[]): Schedule => {
  const validate = (drugs: PrescribedDrug[]): PrescribedDrug[] | null => {
    for (const drug of drugs) {
      if (Object.values(drug).some((v) => v === null)) {
        alert(`Please check ${drug.name} if you fill all the inputs.`);
        return null;
      }
    }
    return drugs;
  };

  const convert = (drugs: PrescribedDrug[]): Converted[] => drugs.map((drug) => {
    const currentDosageSum = drug.currentDosages
      .reduce((acc, d) => acc + parseInt(d.dosage, 10) * d.quantity, 0);
    const nextDosageSum = drug.nextDosages
      .reduce((acc, d) => acc + parseInt(d.dosage, 10) * d.quantity, 0);
    const dosageUnit = drug.currentDosages[0].dosage.match(/[a-z]+/)!;
    const duration = { [drug.intervalUnit.toLowerCase()]: drug.intervalCount };
    const dates = {
      start: drug.intervalStartDate,
      end: add(drug.intervalStartDate, duration),
    };

    return {
      name: drug.brand,
      currentDosageSum,
      nextDosageSum,
      dates,
      changeRate: nextDosageSum / currentDosageSum,
      duration,
      dosageUnit,
      endIntervalsDate: drug.intervalEndDate!,
    };
  });

  const generateTableRows = (drugs: Converted[]): (TableRow & { startDate: Date, endDate: Date })[] => {
    const rows: (TableRow & { startDate: Date, endDate: Date })[] = [];

    for (const drug of drugs) {
      rows.push({
        Drug: drug.name,
        'Current Dosage': `${drug.currentDosageSum}${drug.dosageUnit}`,
        'Next Dosage': `${drug.nextDosageSum}${drug.dosageUnit}`,
        Dates: `${format(drug.dates.start, 'MM/dd/yyyy')} - ${format(drug.dates.end, 'MM/dd/yyyy')}`,
        startDate: drug.dates.start,
        endDate: drug.dates.end,
      });

      const startDate = add(drug.dates.end, { days: 1 });

      const newRowData = {
        Drug: drug.name,
        currentDosageSum: drug.nextDosageSum,
        nextDosageSum: drug.nextDosageSum * drug.changeRate,
        startDate,
        endDate: add(startDate, drug.duration),
      };

      while (isBefore(newRowData.startDate, drug.endIntervalsDate)) {
        if (isAfter(newRowData.endDate, drug.endIntervalsDate)) {
          newRowData.endDate = drug.endIntervalsDate;
        }

        rows.push({
          Drug: drug.name,
          'Current Dosage': `${newRowData.currentDosageSum}${drug.dosageUnit}`,
          'Next Dosage': `${newRowData.nextDosageSum}${drug.dosageUnit}`,
          Dates: `${format(newRowData.startDate, 'MM/dd/yyyy')} - ${format(newRowData.endDate, 'MM/dd/yyyy')}`,
          startDate: newRowData.startDate,
          endDate: newRowData.endDate,
        });

        newRowData.currentDosageSum = newRowData.nextDosageSum;
        newRowData.nextDosageSum = newRowData.currentDosageSum * drug.changeRate;
        newRowData.startDate = add(newRowData.endDate, { days: 1 });
        newRowData.endDate = add(newRowData.startDate, drug.duration);
      }
    }
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

  if (!validate(prescribedDrugs)) {
    return {
      startDates: {}, endDates: {}, data: [], drugs: [],
    };
  }

  const drugNames = prescribedDrugs.map((drug) => drug.name);

  const converted: Converted[] = convert(prescribedDrugs);

  const rows: (TableRow & { startDate: Date, endDate: Date })[] = generateTableRows(converted);

  const tableData: (TableRow & { startDate: Date, endDate: Date })[] = sort(drugNames, rows);

  const schedule: Schedule = {
    startDates: {}, endDates: {}, data: tableData, drugs: [],
  };

  drugNames.forEach((name) => {
    const drug = prescribedDrugs.find((prescribed) => prescribed.name === name)!;
    schedule.startDates[drug.name] = drug.intervalStartDate;
    schedule.endDates[drug.name] = drug.intervalEndDate!;
    schedule.drugs.push(name);
  });

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

  groupByDrug.forEach((drug) => {
    // fill in the gap between start dates

  });

  return groupByDrug;
};

export { scheduleGenerator, chartDataConverter };
