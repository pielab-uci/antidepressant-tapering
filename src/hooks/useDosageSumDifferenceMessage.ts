import { useCallback, useEffect, useState } from 'react';

type Type = (time: 'Current'|'Next', priorDosageSum: number, upcomingDosageSum: number) => string | null;

const useDosageSumDifferenceMessage: Type = (time, priorDosageSum, upcomingDosageSum) => {
  const [dosageDifferenceMessage, setDosageDifferenceMessage] = useState<string|null>(null);

  useEffect(() => {
    if (time === 'Next') {
      if (priorDosageSum === 0) {
        setDosageDifferenceMessage(null);
      }

      if (priorDosageSum > upcomingDosageSum) { // decreasing -> decrease by rate
        setDosageDifferenceMessage(`${Math.abs((upcomingDosageSum - priorDosageSum) / priorDosageSum * 100).toFixed(2)} % decrease`);
      } else if (priorDosageSum < upcomingDosageSum) { // increasing -> increase by amount
        setDosageDifferenceMessage(`${upcomingDosageSum - priorDosageSum} mg increase`);
      } else {
        setDosageDifferenceMessage(null);
      }
    }
  }, [priorDosageSum, upcomingDosageSum]);

  return dosageDifferenceMessage;
};

export default useDosageSumDifferenceMessage;
