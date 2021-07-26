import { useEffect, useState } from 'react';

type Type = (time: 'Current'|'Next', priorDosageSum: number, upcomingDosageSum: number, growth: 'linear' | 'exponential') => string | null;

const useDosageSumDifferenceMessage: Type = (time, priorDosageSum, upcomingDosageSum, growth) => {
  const [dosageDifferenceMessage, setDosageDifferenceMessage] = useState<string|null>(null);

  useEffect(() => {
    if (time === 'Next') {
      const change = priorDosageSum > upcomingDosageSum ? 'decrease'
        : priorDosageSum < upcomingDosageSum ? 'increase'
          : null;

      const difference = growth === 'linear'
        ? `${Math.abs(priorDosageSum - upcomingDosageSum)} mg`
        : priorDosageSum === 0
          ? '100%'
          : `${Math.abs((upcomingDosageSum - priorDosageSum) / priorDosageSum * 100).toFixed(2)} %`;

      if (!change) {
        setDosageDifferenceMessage(null);
      } else {
        setDosageDifferenceMessage(`${difference} ${change}`);
      }
    }
  }, [priorDosageSum, upcomingDosageSum, growth]);

  return dosageDifferenceMessage;
};

export default useDosageSumDifferenceMessage;
