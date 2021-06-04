import { differenceInCalendarDays } from 'date-fns';
import { DrugForm, isCapsuleOrTablet, OralDosage } from '../types';

export const calcIntervalDurationDays = (startDate: Date, endDate: Date|null) => {
  return !endDate ? 0 : differenceInCalendarDays(endDate, startDate) + 1;
};
