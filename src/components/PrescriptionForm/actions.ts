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
  data: { id: number;
    form: string,
    minDosageUnit: number,
    availableDosageOptions: string[],
    oralDosageInfo: OralDosage|null,
    regularDosageOptions: string[]|null };
}

export const PRIOR_DOSAGE_CHANGE = 'PRIOR_DOSAGE_CHANGE' as const;

export interface PriorDosageChangeAction {
  type: typeof PRIOR_DOSAGE_CHANGE;
  data: { id: number, dosage: { dosage: string, quantity: number } };
}

export const priorDosageChange = (data: PriorDosageChangeAction['data']): PriorDosageChangeAction => ({
  type: PRIOR_DOSAGE_CHANGE,
  data,
});

export const UPCOMING_DOSAGE_CHANGE = 'UPCOMING_DOSAGE_CHANGE' as const;

export interface UpcomingDosageChangeAction {
  type: typeof UPCOMING_DOSAGE_CHANGE;
  data: { id: number, dosage: { dosage: string, quantity: number } };
}

export const upcomingDosageChange = (data: UpcomingDosageChangeAction['data']): UpcomingDosageChangeAction => ({
  type: UPCOMING_DOSAGE_CHANGE,
  data,
});

export const SET_TARGET_DOSAGE = 'SET_UPCOMING_DOSAGE_GOAL';

export interface SetUpcomingDosageGoalAction {
  type: typeof SET_TARGET_DOSAGE,
  data: { id: number, dosage: number }
}

export const ALLOW_SPLITTING_UNSCORED_TABLET = 'ALLOW_SPLITTING_UNSCORED_TABLET' as const;

export interface AllowSplittingUnscoredTabletAction {
  type: typeof ALLOW_SPLITTING_UNSCORED_TABLET;
  data: { id: number, allow: boolean };
}

export const toggleAllowSplittingUnscoredTablet = (data: AllowSplittingUnscoredTabletAction['data']): AllowSplittingUnscoredTabletAction => ({
  type: ALLOW_SPLITTING_UNSCORED_TABLET,
  data,
});

export const INTERVAL_START_DATE_CHANGE = 'INTERVAL_START_DATE_CHANGE' as const;

export interface IntervalStartDateChangeAction {
  type: typeof INTERVAL_START_DATE_CHANGE,
  data: {
    date: Date,
    intervalDurationDays: number,
    id: number; } ;
}

export const intervalStartDateChange = (data: IntervalStartDateChangeAction['data']): IntervalStartDateChangeAction => ({
  type: INTERVAL_START_DATE_CHANGE,
  data,
});

export const INTERVAL_END_DATE_CHANGE = 'INTERVAL_END_DATE_CHANGE' as const;

export interface IntervalEndDateChangeAction {
  type: typeof INTERVAL_END_DATE_CHANGE,
  data: {
    date: Date | null;
    intervalDurationDays: number,
    id: number }
}

export const intervalEndDateChange = (data: IntervalEndDateChangeAction['data']): IntervalEndDateChangeAction => ({
  type: INTERVAL_END_DATE_CHANGE,
  data,
});

export const INTERVAL_COUNT_CHANGE = 'INTERVAL_COUNT_CHANGE' as const;

export interface IntervalCountChangeAction {
  type: typeof INTERVAL_COUNT_CHANGE,
  data: {
    count: number,
    intervalDurationDays: number,
    intervalEndDate: Date | null,
    id:number }
}

export const intervalCountChange = (data: IntervalCountChangeAction['data']): IntervalCountChangeAction => ({
  type: INTERVAL_COUNT_CHANGE,
  data,
});

export const INTERVAL_UNIT_CHANGE = 'INTERVAL_UNIT_CHANGE' as const;

export interface IntervalUnitChangeAction {
  type: typeof INTERVAL_UNIT_CHANGE;
  data: {
    unit: 'Days' | 'Weeks' | 'Months',
    intervalEndDate: Date,
    intervalDurationDays: number,
    id: number }
}

export const intervalUnitChange = (data: IntervalUnitChangeAction['data']): IntervalUnitChangeAction => ({
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
  | SetUpcomingDosageGoalAction
  | AllowSplittingUnscoredTabletAction
  | IntervalActions;
