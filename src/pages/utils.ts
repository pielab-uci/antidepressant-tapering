import { add, format } from 'date-fns';
import { PrescribedDrug } from '../types';

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

      const endDate = format(drug.intervalEndDate!, 'MMM dd, yyyy');
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

export { messageGenerator };
