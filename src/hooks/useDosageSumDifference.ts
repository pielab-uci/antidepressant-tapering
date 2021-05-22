import { useCallback, useEffect, useState } from 'react';

type Type = (time: 'Prior'|'Upcoming', priorDosageQty: { [dosage: string]: number }, upcomingDosageQty: { [dosage: string]: number }) => [(string|null), (dosages: { [dosage: string]: number }) => number];
export const useDosageSumAndDifferenceMessage: Type = (time, priorDosageQty, upcomingDosageQty) => {
  const [dosageDifferenceMessage, setDosageDifferenceMessage] = useState<string|null>(null);

  const calculateDosageSum = useCallback((dosages: { [key: string]: number }): number => Object
    .entries(dosages)
    .reduce((acc, [dosage, count]) => acc + parseFloat(dosage) * count, 0), []);

  useEffect(() => {
    if (time === 'Upcoming') {
      const priorDosageSum = calculateDosageSum(priorDosageQty);
      const upcomingDosageSum = calculateDosageSum(upcomingDosageQty);

      if (priorDosageSum === 0) {
        setDosageDifferenceMessage(null);
      }

      if (priorDosageSum > upcomingDosageSum) { // decreasing -> decrease by rate
        setDosageDifferenceMessage(`${((upcomingDosageSum - priorDosageSum) / priorDosageSum * 100).toFixed(2)} percent decrease`);
      } else if (priorDosageSum < upcomingDosageSum) { // increasing -> increase by amount
        setDosageDifferenceMessage(`${upcomingDosageSum - priorDosageSum} mg increase`);
      } else {
        setDosageDifferenceMessage(null);
      }
    }
  }, [priorDosageQty, upcomingDosageQty]);

  return [dosageDifferenceMessage, calculateDosageSum];
};
