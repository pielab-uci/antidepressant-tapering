import { Drug, PrescribedDrug } from '../../types';

export const LOAD_PRESCRIPTION_DATA = 'LOAD_PRESCRIPTION_DATA' as const;

export interface LoadPrescriptionDataAction {
  type: typeof LOAD_PRESCRIPTION_DATA,
  data: PrescribedDrug;
}

export const FETCH_DRUGS = 'FETCH_DRUGS' as const;

export interface FetchDrugsAction {
  type: typeof FETCH_DRUGS,
  data: { drugs: Drug[], id: number }
}

export const CHOOSE_BRAND = 'CHOOSE_BRAND' as const;

export interface ChooseBrandAction {
  type: typeof CHOOSE_BRAND,
  data: { id: number; brand: string };
}

export const CHOOSE_FORM = 'CHOOSE_FORM' as const;

export interface ChooseFormAction {
  type: typeof CHOOSE_FORM,
  data: { id: number; form: string, minDosageUnit?: number, availableDosageOptions?: string[] };
}

export const CURRENT_DOSAGE_CHANGE = 'CURRENT_DOSAGE_CHANGE' as const;

export interface CurrentDosageChangeAction {
  type: typeof CURRENT_DOSAGE_CHANGE;
  data: { id: number, dosage: { dosage: string, quantity: number } };
}

export const currentDosageChange = (data: { id: number, dosage: { dosage: string, quantity: number } }): CurrentDosageChangeAction => ({
  type: CURRENT_DOSAGE_CHANGE,
  data,
});

export const NEXT_DOSAGE_CHANGE = 'NEXT_DOSAGE_CHANGE' as const;

export interface NextDosageChangeAction {
  type: typeof NEXT_DOSAGE_CHANGE;
  data: { id: number, dosage: { dosage: string, quantity: number }, intervalDurationDays?: number };
}

export const nextDosageChange = (data: {
  id: number, dosage: { dosage: string, quantity: number }, intervalDurationDays?: number
}): NextDosageChangeAction => ({
  type: NEXT_DOSAGE_CHANGE,
  data,
});

export const PRESCRIBED_QUANTITY_CHANGE = 'PRESCRIBED_QUANTITY_CHANGE' as const;

export interface PrescribedQuantityChange {
  type: typeof PRESCRIBED_QUANTITY_CHANGE,
  data: { id: number, dosage: { dosage: string, quantity: number }, intervalDurationDays?: number }
}

export const prescribedQuantityChange = (data: {
  id: number, dosage: { dosage: string, quantity: number }, intervalDurationDays?: number
}): PrescribedQuantityChange => ({
  type: PRESCRIBED_QUANTITY_CHANGE,
  data,
});

export const CURRENT_ALLOW_SPLITTING_UNSCORED_DOSAGE_UNIT = 'CURRENT_ALLOW_SPLITTING_UNSCORED_DOSAGE_UNIT' as const;

export interface CurrentAllowSplittingUnscoredDosageUnitAction {
  type: typeof CURRENT_ALLOW_SPLITTING_UNSCORED_DOSAGE_UNIT;
  data: { id: number, allow: boolean };
}

export const currentAllowSplittingUnscoredDosageUnit = (data: { id: number, allow: boolean }): CurrentAllowSplittingUnscoredDosageUnitAction => {
  return {
    type: CURRENT_ALLOW_SPLITTING_UNSCORED_DOSAGE_UNIT,
    data,
  };
};

export const NEXT_ALLOW_SPLITTING_UNSCORED_DOSAGE_UNIT = 'NEXT_ALLOW_SPLITTING_UNSCORED_DOSAGE_UNIT' as const;

export interface NextAllowSplittingUnscoredDosageUnitAction {
  type: typeof NEXT_ALLOW_SPLITTING_UNSCORED_DOSAGE_UNIT;
  data: { id: number, allow: boolean; }
}

export const nextAllowSplittingUnscoredDosageUnit = (data: { id: number, allow: boolean }): NextAllowSplittingUnscoredDosageUnitAction => {
  return {
    type: NEXT_ALLOW_SPLITTING_UNSCORED_DOSAGE_UNIT,
    data,
  };
};

export const INTERVAL_START_DATE_CHANGE = 'INTERVAL_START_DATE_CHANGE' as const;

export interface IntervalStartDateChangeAction {
  type: typeof INTERVAL_START_DATE_CHANGE,
  data: { date: Date, intervalDurationDays?: number, id: number; } ;
}

export const intervalStartDateChange = (data: { date: Date, intervalDurationDays?: number, id: number }): IntervalStartDateChangeAction => ({
  type: INTERVAL_START_DATE_CHANGE,
  data,
});

export const INTERVAL_END_DATE_CHANGE = 'INTERVAL_END_DATE_CHANGE' as const;

export interface IntervalEndDateChangeAction {
  type: typeof INTERVAL_END_DATE_CHANGE,
  data: { date: Date | null; intervalDurationDays?: number, id: number }
}

export const intervalEndDateChange = (data: { date: Date | null, intervalDurationDays?: number, id: number }): IntervalEndDateChangeAction => ({
  type: INTERVAL_END_DATE_CHANGE,
  data,
});

export const INTERVAL_COUNT_CHANGE = 'INTERVAL_COUNT_CHANGE' as const;

export interface IntervalCountChangeAction {
  type: typeof INTERVAL_COUNT_CHANGE,
  data: { count: number, intervalDurationDays?: number, id:number }
}

export const intervalCountChange = (data: { count: number, intervalDurationDays?: number, id: number }): IntervalCountChangeAction => ({
  type: INTERVAL_COUNT_CHANGE,
  data,
});

export const INTERVAL_UNIT_CHANGE = 'INTERVAL_UNIT_CHANGE' as const;

export interface IntervalUnitChangeAction {
  type: typeof INTERVAL_UNIT_CHANGE;
  data: { unit: 'Days' | 'Weeks' | 'Months', intervalDurationDays?: number, id: number }
}

export const intervalUnitChange = (data: { unit: 'Days' | 'Weeks' | 'Months', intervalDurationDays?: number, id: number }): IntervalUnitChangeAction => ({
  type: INTERVAL_UNIT_CHANGE,
  data,
});

export const INTERVAL_DURATION_IN_DAYS_CHANGE = 'INTERVAL_DURATION_IN_DAYS_CHANGE' as const;
export interface IntervalDurationDaysChange {
  type: typeof INTERVAL_DURATION_IN_DAYS_CHANGE,
  data: { durationDays: number, id: number };
}
export const intervalDurationDaysChange = (data: { durationDays: number, id: number }): IntervalDurationDaysChange => ({
  type: INTERVAL_DURATION_IN_DAYS_CHANGE,
  data,
});

export type PrescriptionFormActions =
  | FetchDrugsAction
  | LoadPrescriptionDataAction
  | ChooseBrandAction
  | ChooseFormAction
  | CurrentDosageChangeAction
  | NextDosageChangeAction
  | CurrentAllowSplittingUnscoredDosageUnitAction
  | NextAllowSplittingUnscoredDosageUnitAction
  | IntervalStartDateChangeAction
  | IntervalEndDateChangeAction
  | IntervalUnitChangeAction
  | IntervalCountChangeAction
  | IntervalDurationDaysChange
  | PrescribedQuantityChange;
