import { add, format } from 'date-fns';
import { PrescribedDrug } from '../types';
import { Schedule } from '../components/ProjectedSchedule';

// TODO: casing for more natural messages
const messageGenerateFromSchedule = (schedule: Schedule): string => {
  return schedule.data
    .filter((row) => row.selected)
    .reduce((message, row, i, arr) => {
      const dosages = Object.entries(row.prescribedDosages)
        .reduce(
          (prev, [dosage, qty]) => `${prev} ${qty} ${dosage} ${row.form}`,
          'Take',
        );
      const startDate = format(row.startDate, 'MMM dd, yyyy');
      const endDate = format(row.endDate, 'MMM dd, yyyy');
      return `${message} ${dosages}(s) of ${row.Drug} from ${startDate} to ${endDate}.\n`;
    }, '');
};

const messageGenerator = (drugs: PrescribedDrug[]): string => {
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
      const startDate = format(drug.intervalStartDate, 'MMM dd, yyyy');
      const endDate = format(drug.intervalEndDate!, 'MMM dd, yyyy');

      if (arr.length === 1) {
        return `${message} ${dosages} of ${drug.brand} from ${startDate} to ${endDate}.`;
      }

      if (drugIdx === arr.length - 1) {
        return `${message} and ${dosages} of ${drug.brand} from ${startDate} to ${endDate}.`;
      }
      return `${message} ${dosages} of ${drug.brand} from ${startDate} to ${endDate},`;
    }, 'Take',
  );
};

export { messageGenerator, messageGenerateFromSchedule };
