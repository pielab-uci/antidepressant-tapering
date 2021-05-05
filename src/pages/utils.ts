import { add, format } from 'date-fns';
import { PrescribedDrug } from '../types';

export const messageGenerator = (drugs: PrescribedDrug[]): string => {
  return drugs.reduce(
    (message, drug, i, arr) => {
      const dosages = drug.nextDosages.reduce(
        (str, dosage, i, nextDosageArr) => {
          if (nextDosageArr.length === 1) {
            return `${dosage.dosage} ${drug.form}`;
          }
          if (i === nextDosageArr.length - 1) {
            return `${str} and ${dosage.dosage} ${drug.form}`;
          }
          return `${str}, ${dosage.dosage} ${drug.form}`;
        }, '',
      );

      const nextDosageEndDate = format(add(drug.intervalStartDate, { [drug.intervalUnit.toLowerCase()]: drug.intervalCount }), 'MM-dd');
      if (arr.length === 1) {
        return `${message} ${dosages} of ${drug.brand} until ${nextDosageEndDate}`;
      }

      if (i === arr.length - 1) {
        return `${message} and ${dosages} of ${drug.brand} until ${nextDosageEndDate}`;
      }

      return `${message} ${dosages} of ${drug.brand} until ${nextDosageEndDate}`;
    }, 'Take',
  );
};
