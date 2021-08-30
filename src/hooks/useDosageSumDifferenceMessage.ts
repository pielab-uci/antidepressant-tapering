import { useEffect, useState } from 'react';

type Type = (time: 'Current'|'Next', priorDosageSum: number, upcomingDosageSum: number, growth: 'linear' | 'exponential') => string | null;

const useDosageSumDifferenceMessage: Type = (time, currentDosageSum, nextDosageSum, growth) => {
  const [dosageDifferenceMessage, setDosageDifferenceMessage] = useState<string|null>(null);

  useEffect(() => {
    if (time === 'Next') {
      const change = currentDosageSum > nextDosageSum ? 'decrease'
        : currentDosageSum < nextDosageSum ? 'increase'
          : null;

      const difference = growth === 'linear'
        ? `${Math.abs(currentDosageSum - nextDosageSum)} mg`
        : currentDosageSum === 0
          ? '100%'
          : `${Math.abs((nextDosageSum - currentDosageSum) / currentDosageSum * 100).toFixed(2)} %`;

      if (!change) {
        setDosageDifferenceMessage(null);
      } else {
        setDosageDifferenceMessage(`${difference} ${change}`);
      }
    }
  }, [currentDosageSum, nextDosageSum, growth]);

  return dosageDifferenceMessage;
};

export default useDosageSumDifferenceMessage;
