import {
  Drug, DrugFormNames, PillDosage, OralDosage, PrescribedDrug,
} from '../../types';
import { SetIsInputComplete, ValidateInputCompletionAction } from '../../redux/actions/taperConfig';

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
    form: DrugFormNames,
    minDosageUnit: number,
    availableDosageOptions: string[],
    oralDosageInfo: OralDosage|null,
    regularDosageOptions: string[]|null };
}

export const CURRENT_DOSAGE_CHANGE = 'CURRENT_DOSAGE_CHANGE' as const;

export interface CurrentDosageChangeAction {
  type: typeof CURRENT_DOSAGE_CHANGE;
  data: { id: number, dosage: { dosage: string, quantity: number } };
}

export const currentDosageChange = (data: CurrentDosageChangeAction['data']): CurrentDosageChangeAction => ({
  type: CURRENT_DOSAGE_CHANGE,
  data,
});

export const NEXT_DOSAGE_CHANGE = 'NEXT_DOSAGE_CHANGE' as const;

export interface NextDosageChangeAction {
  type: typeof NEXT_DOSAGE_CHANGE;
  data: { id: number, dosage: { dosage: string, quantity: number } };
}

export const nextDosageChange = (data: NextDosageChangeAction['data']): NextDosageChangeAction => ({
  type: NEXT_DOSAGE_CHANGE,
  data,
});

export const SET_GOAL_DOSAGE = 'SET_NEXT_DOSAGE_GOAL';

export interface SetNextDosageGoalAction {
  type: typeof SET_GOAL_DOSAGE,
  data: { id: number, dosage: number }
}

export const ALLOW_SPLITTING_UNSCORED_TABLET = 'ALLOW_SPLITTING_UNSCORED_TABLET' as const;

export interface AllowSplittingUnscoredTabletAction {
  type: typeof ALLOW_SPLITTING_UNSCORED_TABLET;
  data: { id: number, allow: boolean, dosageOptions: PillDosage[] };
}

export const toggleAllowSplittingUnscoredTablet = (data: AllowSplittingUnscoredTabletAction['data']): AllowSplittingUnscoredTabletAction => ({
  type: ALLOW_SPLITTING_UNSCORED_TABLET,
  data,
});

export const INTERVAL_START_DATE_CHANGE = 'INTERVAL_START_DATE_CHANGE' as const;

export interface IntervalStartDateChangeData {
  intervalStartDate: Date;
  intervalEndDate?: Date;
  intervalDurationDays?: number;
  intervalUnit?: 'Days'|'Weeks'|'Months';
  intervalCount?: number;
  id: number;
}

export interface IntervalStartDateChangeAction {
  type: typeof INTERVAL_START_DATE_CHANGE,
  data: IntervalStartDateChangeData;
}

export const intervalStartDateChange = (data: IntervalStartDateChangeAction['data']): IntervalStartDateChangeAction => ({
  type: INTERVAL_START_DATE_CHANGE,
  data,
});

export const INTERVAL_END_DATE_CHANGE = 'INTERVAL_END_DATE_CHANGE' as const;

export interface IntervalEndDateChangeData {
  intervalStartDate?: Date;
  intervalEndDate: Date;
  intervalDurationDays?: number;
  intervalUnit? :'Days' | 'Weeks' | 'Months';
  intervalCount?: number;
  id: number;
}
export interface IntervalEndDateChangeAction {
  type: typeof INTERVAL_END_DATE_CHANGE,
  data: IntervalEndDateChangeData;
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
    intervalCount: number,
    intervalDurationDays: number,
    id: number }
}

export const intervalUnitChange = (data: IntervalUnitChangeAction['data']): IntervalUnitChangeAction => ({
  type: INTERVAL_UNIT_CHANGE,
  data,
});

export const SET_IS_MODAL = 'SET_IS_MODAL' as const;

export interface SetIsModalAction {
  type: typeof SET_IS_MODAL,
  data: { isModal: boolean }
}

export const SET_GROWTH = 'SET_GROWTH' as const;

export interface SetGrowthAction {
  type: typeof SET_GROWTH,
  data: { growth: 'linear' | 'exponential', id: number };
}

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
  | CurrentDosageChangeAction
  | NextDosageChangeAction
  | SetNextDosageGoalAction
  | AllowSplittingUnscoredTabletAction
  | SetIsModalAction
  | SetGrowthAction
  | SetIsInputComplete
  | ValidateInputCompletionAction
  | IntervalActions;
