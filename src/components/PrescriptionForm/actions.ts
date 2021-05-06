import { Drug } from '../../types';
import { IntervalConfigActions } from '../../redux/actions/taperConfig';

export const FETCH_DRUGS = 'FETCH_DRUGS' as const;

export interface FetchDrugsAction {
  type: typeof FETCH_DRUGS,
  data: Drug[];
}

export const DRUG_NAME_CHANGE = 'DRUG_NAME_CHANGE' as const;

export interface DrugNameChangeAction {
  type: typeof DRUG_NAME_CHANGE;
  data: { id: number, name: string };
}

export const CHOOSE_BRAND = 'CHOOSE_BRAND' as const;

export interface ChooseBrandAction {
  type: typeof CHOOSE_BRAND,
  data: { id: number; brand: string };
}

export const CHOOSE_FORM = 'CHOOSE_FORM' as const;

export interface ChooseFormAction {
  type: typeof CHOOSE_FORM,
  data: { id: number; form: string };
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
  data: { id: number, dosage: { dosage: string, quantity: number }, intervalDurationDays: number };
}

export const nextDosageChange = (data: {
  id: number, dosage: { dosage: string, quantity: number }, intervalDurationDays: number
}): NextDosageChangeAction => ({
  type: NEXT_DOSAGE_CHANGE,
  data,
});

export const PRESCRIBED_QUANTITY_CHANGE = 'PRESCRIBED_QUANTITY_CHANGE' as const;

export interface PrescribedQuantityChange {
  type: typeof PRESCRIBED_QUANTITY_CHANGE,
  data: { id: number, dosage: { dosage: string, quantity: number }, intervalDurationDays: number }
}

export const prescribedQuantityChange = (data: {
  id: number, dosage: { dosage: string, quantity: number }, intervalDurationDays: number
}) => ({
  type: PRESCRIBED_QUANTITY_CHANGE,
  data,
});

export const INTERVAL_DURATION_IN_DAYS_CHANGE = 'INTERVAL_DURATION_IN_DAYS_CHANGE' as const;
export interface IntervalDurationDaysChange {
  type: typeof INTERVAL_DURATION_IN_DAYS_CHANGE,
  data: number;
}
export const intervalDurationDaysChange = (data: number): IntervalDurationDaysChange => ({
  type: INTERVAL_DURATION_IN_DAYS_CHANGE,
  data,
});

export type PrescriptionFormActions =
  | FetchDrugsAction
  | DrugNameChangeAction
  | ChooseBrandAction
  | ChooseFormAction
  | CurrentDosageChangeAction
  | NextDosageChangeAction
  | IntervalDurationDaysChange
  | PrescribedQuantityChange;
