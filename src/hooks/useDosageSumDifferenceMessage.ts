import { useCallback, useEffect, useState } from 'react';

type Type = (time: 'Prior'|'Upcoming', priorDosageQty: { [dosage: string]: number }, upcomingDosageQty: { [dosage: string]: number }) => [(string|null), number];

const useDosageSumDifferenceMessage: Type = (time, priorDosageQty, upcomingDosageQty) => {
  const [dosageDifferenceMessage, setDosageDifferenceMessage] = useState<string|null>(null);

  const calculateDosageSum = useCallback((dosages: { [key: string]: number }): number => Object
    .entries(dosages)
    .reduce((acc, [dosage, count]) => acc + parseFloat(dosage) * count, 0), []);

  const [dosageSum, setDosageSum] = useState(0);

  useEffect(() => {
    const priorDosageSum = calculateDosageSum(priorDosageQty);
    const upcomingDosageSum = calculateDosageSum(upcomingDosageQty);
    if (time === 'Upcoming') {
      if (priorDosageSum === 0) {
        setDosageDifferenceMessage(null);
      }

      if (priorDosageSum > upcomingDosageSum) { // decreasing -> decrease by rate
        setDosageDifferenceMessage(`${Math.abs((upcomingDosageSum - priorDosageSum) / priorDosageSum * 100).toFixed(2)} percent decrease`);
      } else if (priorDosageSum < upcomingDosageSum) { // increasing -> increase by amount
        setDosageDifferenceMessage(`${upcomingDosageSum - priorDosageSum} mg increase`);
      } else {
        setDosageDifferenceMessage(null);
      }
      setDosageSum(upcomingDosageSum);
    } else {
      setDosageSum(priorDosageSum);
    }
  }, [priorDosageQty, upcomingDosageQty]);

  return [dosageDifferenceMessage, dosageSum];
};

export default useDosageSumDifferenceMessage;
