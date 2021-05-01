import {PrescribedDrug} from "../../types";
import {add, format, isAfter, isBefore} from "date-fns";
import {TableRow} from "../../components/ProjectedScheduleTable";

interface Converted {
  name: string,
  currentDosageSum: number,
  nextDosageSum: number,
  dates: { start: Date, end: Date },
  changeRate: number,
  duration: { [key in "days" | "weeks" | "months"]?: number },
  dosageUnit: RegExpMatchArray,
  endIntervalsDate: Date
}

const validate = (prescribedDrugs: PrescribedDrug[]): PrescribedDrug[] | null => {
  for (const drug of prescribedDrugs) {
    if (Object.entries(drug).some(([k, v]) => v === null)) {
      alert(`Please check ${drug.name} if you fill all the inputs.`);
      return null;
    }
  }
  return prescribedDrugs;
}

const convert = (prescribedDrugs: PrescribedDrug[]): Converted[] => {
  return prescribedDrugs.map(drug => {
    const currentDosageSum = drug.currentDosages.reduce((acc, d) => acc + parseInt(d.dosage) * d.quantity, 0);
    const nextDosageSum = drug.nextDosages.reduce((acc, d) => acc + parseInt(d.dosage) * d.quantity, 0);
    const dosageUnit = drug.currentDosages[0].dosage.match(/[a-z]+/)!;
    const duration = {[drug.intervalUnit.toLowerCase()]: drug.intervalCount}
    const dates = {
      start: drug.intervalStartDate,
      end: add(drug.intervalStartDate, duration),
    };

    return {
      name: drug.name,
      currentDosageSum,
      nextDosageSum,
      dates,
      changeRate: currentDosageSum / nextDosageSum,
      duration,
      dosageUnit,
      endIntervalsDate: drug.intervalEndDate!
    }
  });
}

const generateTableRows = (drugs: Converted[]): (TableRow & { startDate: Date })[] => {

  const rows: (TableRow & { startDate: Date })[] = []

  for (const drug of drugs) {
    rows.push({
      Drug: drug.name,
      "Current Dosage": `${drug.currentDosageSum}${drug.dosageUnit}`,
      "Next Dosage": `${drug.nextDosageSum}${drug.dosageUnit}`,
      Dates: `${format(drug.dates.start, 'MM/dd/yyyy')} - ${format(drug.dates.end, 'MM/dd/yyyy')}`,
      startDate: drug.dates.start,
    });

    const startDate = add(drug.dates.end, {days: 1});

    const newRowData = {
      Drug: drug.name,
      currentDosageSum: drug.nextDosageSum,
      nextDosageSum: drug.nextDosageSum * drug.changeRate,
      startDate,
      endDate: add(startDate, drug.duration),
    }

    while (isBefore(newRowData.startDate, drug.endIntervalsDate)) {
      if (isAfter(newRowData.endDate, drug.endIntervalsDate)) {
        newRowData.endDate = drug.endIntervalsDate;
      }

      rows.push({
        Drug: drug.name,
        "Current Dosage": `${newRowData.currentDosageSum}${drug.dosageUnit}`,
        "Next Dosage": `${newRowData.nextDosageSum}${drug.dosageUnit}`,
        Dates: `${format(newRowData.startDate, 'MM/dd/yyyy')} - ${format(newRowData.endDate, 'MM/dd/yyyy')}`,
        startDate: newRowData.startDate
      });

      newRowData.currentDosageSum = newRowData.nextDosageSum;
      newRowData.nextDosageSum = newRowData.currentDosageSum * drug.changeRate;
      newRowData.startDate = add(newRowData.endDate, {days: 1});
      newRowData.endDate = add(newRowData.startDate, drug.duration);
    }
  }
  return rows;
}

const sort = (drugNames: string[], rows: (TableRow & { startDate: Date })[]): TableRow[] => {

  const compare = (a: TableRow & { startDate: Date }, b: TableRow & { startDate: Date })=> {
    if (isBefore(a.startDate, b.startDate)) {
      return -1;
    } else if (a.startDate === b.startDate) {
      return 1;
    }

    const compareDrugNames = drugNames.findIndex(drug => drug === a.Drug) < drugNames.findIndex(drug => drug === b.Drug)
    if (compareDrugNames) {
      return -1;
    } else {
      return 1;
    }
  }

  return rows.sort(compare).map(row => ({
    Drug: row.Drug,
    'Current Dosage': row["Current Dosage"],
    'Next Dosage': row["Next Dosage"],
    Dates: row.Dates
  }))
}

const scheduleGenerator = (prescribedDrugs: PrescribedDrug[]): TableRow[] | [] => {
  if (!validate(prescribedDrugs)) {
    return [];
  }

  const drugNames = prescribedDrugs.map(drug => drug.name);

  const converted: Converted[] = convert(prescribedDrugs);

  const rows: (TableRow & { startDate: Date })[] = generateTableRows(converted);

  const tableData: TableRow[] = sort(drugNames, rows);

  return tableData;
}

export default scheduleGenerator;
