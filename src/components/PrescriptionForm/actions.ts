import { Drug } from '../../types';

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
  data: { id: number, dosage: { dosage: string, quantity: number } };
}

export const nextDosageChange = (data: {
  id: number, dosage: { dosage: string, quantity: number }
}): NextDosageChangeAction => ({
  type: NEXT_DOSAGE_CHANGE,
  data,
});

export const PRESCRIBED_QUANTITY_CHANGE = 'PRESCRIBED_QUANTITY_CHANGE' as const;

export interface PrescribedQuantityChange {
  type: typeof PRESCRIBED_QUANTITY_CHANGE,
  data: { id: number, dosage: { dosage: string, quantity: number } }
}

export const prescribedQuantityChange = (data: {
  id: number, dosage: { dosage: string, quantity: number }
}) => ({
  type: PRESCRIBED_QUANTITY_CHANGE,
  data,
});

export const INTERVAL_START_DATE_CHANGE = 'INTERVAL_START_DATE_CHANGE' as const;

export interface IntervalStartDateChangeAction {
  type: typeof INTERVAL_START_DATE_CHANGE,
  data: { id: number, date: Date };
}

export const intervalStartDateChange = (data: { id: number, date: Date }): IntervalStartDateChangeAction => ({
  type: INTERVAL_START_DATE_CHANGE,
  data,
});

export const INTERVAL_END_DATE_CHANGE = 'INTERVAL_END_DATE_CHANGE' as const;

export interface IntervalEndDateChangeAction {
  type: typeof INTERVAL_END_DATE_CHANGE,
  data: { id: number, date: Date | null };
}

export const intervalEndDateChange = (data: { id: number, date: Date | null }): IntervalEndDateChangeAction => ({
  type: INTERVAL_END_DATE_CHANGE,
  data,
});

export const INTERVAL_COUNT_CHANGE = 'INTERVAL_COUNT_CHANGE' as const;

export interface IntervalCountChangeAction {
  type: typeof INTERVAL_COUNT_CHANGE,
  data: { id: number, count: number };
}

export const intervalCountChange = (data: { id: number, count: number }): IntervalCountChangeAction => ({
  type: INTERVAL_COUNT_CHANGE,
  data,
});

export const INTERVAL_UNIT_CHANGE = 'INTERVAL_UNIT_CHANGE' as const;

export interface IntervalUnitChangeAction {
  type: typeof INTERVAL_UNIT_CHANGE;
  data: { id: number, unit: 'Days' | 'Weeks' | 'Months' };
}

export const intervalUnitChange = (data: { id: number, unit: 'Days' | 'Weeks' | 'Months' }): IntervalUnitChangeAction => ({
  type: INTERVAL_UNIT_CHANGE,
  data,
});

export type PrescriptionFormActions =
  | FetchDrugsAction
  | DrugNameChangeAction
  | ChooseBrandAction
  | ChooseFormAction
  | CurrentDosageChangeAction
  | NextDosageChangeAction
  | PrescribedQuantityChange
  | IntervalStartDateChangeAction
  | IntervalEndDateChangeAction
  | IntervalCountChangeAction
  | IntervalUnitChangeAction;
