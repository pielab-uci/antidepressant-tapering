import { Drug, OralDosage, PrescribedDrug } from '../../types';

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
  data: { id: number; form: string, minDosageUnit?: number, availableDosageOptions?: string[], oralDosageInfo?: OralDosage|null };
}

export const PRIOR_DOSAGE_CHANGE = 'PRIOR_DOSAGE_CHANGE' as const;

export interface PriorDosageChangeAction {
  type: typeof PRIOR_DOSAGE_CHANGE;
  data: { id: number, dosage: { dosage: string, quantity: number } };
}

export const priorDosageChange = (data: { id: number, dosage: { dosage: string, quantity: number } }): PriorDosageChangeAction => ({
  type: PRIOR_DOSAGE_CHANGE,
  data,
});

export const UPCOMING_DOSAGE_CHANGE = 'UPCOMING_DOSAGE_CHANGE' as const;

export interface UpcomingDosageChangeAction {
  type: typeof UPCOMING_DOSAGE_CHANGE;
  data: { id: number, dosage: { dosage: string, quantity: number }, intervalDurationDays?: number };
}

export const upcomingDosageChange = (data: {
  id: number, dosage: { dosage: string, quantity: number }, intervalDurationDays?: number
}): UpcomingDosageChangeAction => ({
  type: UPCOMING_DOSAGE_CHANGE,
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

export const ALLOW_SPLITTING_UNSCORED_TABLET = 'ALLOW_SPLITTING_UNSCORED_TABLET' as const;

export interface AllowSplittingUnscoredTabletAction {
  type: typeof ALLOW_SPLITTING_UNSCORED_TABLET;
  data: { id: number, allow: boolean };
}

export const toggleAllowSplittingUnscoredTablet = (data: { id: number, allow: boolean }): AllowSplittingUnscoredTabletAction => ({
  type: ALLOW_SPLITTING_UNSCORED_TABLET,
  data,
});

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

export type IntervalActions =
  | IntervalStartDateChangeAction
  | IntervalEndDateChangeAction
  | IntervalUnitChangeAction
  | IntervalCountChangeAction;

export type PrescriptionFormActions =
  | FetchDrugsAction
  | LoadPrescriptionDataAction
  | ChooseBrandAction
  | ChooseFormAction
  | PriorDosageChangeAction
  | UpcomingDosageChangeAction
  | AllowSplittingUnscoredTabletAction
  | IntervalActions
  | PrescribedQuantityChange;
