import { add, format } from 'date-fns';
import { PrescribedDrug } from '../types';

export const messageGenerator = (drugs: PrescribedDrug[], intervalStartDate: Date, intervalEndDate: Date): string => {
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

      if (arr.length === 1) {
        return `${message} ${dosages} of ${drug.brand} until ${intervalEndDate}`;
      }

      if (drugIdx === arr.length - 1) {
        return `${message} and ${dosages} of ${drug.brand} until ${intervalEndDate}`;
      }

      return `${message} ${dosages} of ${drug.brand} until ${intervalEndDate}`;
    }, 'Take',
  );
};
