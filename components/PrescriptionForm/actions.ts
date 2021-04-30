import {Drug} from "../../types";

export const FETCH_DRUGS = "FETCH_DRUGS" as const;

export interface FetchDrugsAction {
  type: typeof FETCH_DRUGS,
  data: Drug[];
}

export const DRUG_NAME_CHANGE = "DRUG_NAME_CHANGE" as const;

export interface DrugNameChangeAction {
  type: typeof DRUG_NAME_CHANGE;
  data: string;
}

export const CHOOSE_BRAND = "CHOOSE_BRAND" as const;

export interface ChooseBrandAction {
  type: typeof CHOOSE_BRAND,
  data: string;
}

export const CHOOSE_FORM = "CHOOSE_FORM" as const;

export interface ChooseFormAction {
  type: typeof CHOOSE_FORM,
  data: string;
}

export const CURRENT_DOSAGE_CHANGE = "CURRENT_DOSAGE_CHANGE" as const;

export interface CurrentDosageChangeAction {
  type: typeof CURRENT_DOSAGE_CHANGE;
  data: { dosage: string, quantity: number };
}

export const currentDosageChange = (data: { dosage: string, quantity: number }): CurrentDosageChangeAction => {
  console.group("currentDosageChange")
  console.log("data: ", data);
  console.groupEnd();
  return ({
    type: CURRENT_DOSAGE_CHANGE,
    data,
  });
}

export const NEXT_DOSAGE_CHANGE = "NEXT_DOSAGE_CHANGE" as const;


export interface NextDosageChangeAction {
  type: typeof NEXT_DOSAGE_CHANGE;
  data: { dosage: string, quantity: number };
}

export const nextDosageChange = (data: { dosage: string, quantity: number }): NextDosageChangeAction => {
  console.group("nextDosageChange")
  console.log("data: ", data)
  console.groupEnd();
  return ({
    type: NEXT_DOSAGE_CHANGE,
    data
  })
};

export const INTERVAL_START_DATE_CHANGE = "INTERVAL_START_DATE_CHANGE" as const;

export interface IntervalStartDateChangeAction {
  type: typeof INTERVAL_START_DATE_CHANGE,
  data: Date;
}

export const intervalStartDateChange = (data: Date): IntervalStartDateChangeAction => ({
  type: INTERVAL_START_DATE_CHANGE,
  data,
})

export const INTERVAL_END_DATE_CHANGE = "INTERVAL_END_DATE_CHANGE" as const;

export interface IntervalEndDateChangeAction {
  type: typeof INTERVAL_END_DATE_CHANGE,
  data: Date | null;
}

export const intervalEndDateChange = (data: Date|null): IntervalEndDateChangeAction => ({
  type: INTERVAL_END_DATE_CHANGE,
  data,
});

export const INTERVAL_COUNT_CHANGE = "INTERVAL_COUNT_CHANGE" as const;

export interface IntervalCountChangeAction {
  type: typeof INTERVAL_COUNT_CHANGE,
  data: number;
}

export const intervalCountChange = (data: number): IntervalCountChangeAction => ({
  type: INTERVAL_COUNT_CHANGE,
  data
});

export const INTERVAL_UNIT_CHANGE = "INTERVAL_UNIT_CHANGE" as const;

export interface IntervalUnitChangeAction {
  type: typeof INTERVAL_UNIT_CHANGE;
  data: "Days"|"Weeks"|"Months";
}

export const intervalUnitChange = (data: "Days"|"Weeks"|"Months"): IntervalUnitChangeAction => ({
  type: INTERVAL_UNIT_CHANGE,
  data,
})

export type PrescriptionFormActions =
  | FetchDrugsAction
  | DrugNameChangeAction
  | ChooseBrandAction
  | ChooseFormAction
  | CurrentDosageChangeAction
  | NextDosageChangeAction
  | IntervalStartDateChangeAction
  | IntervalEndDateChangeAction
  | IntervalCountChangeAction
  | IntervalUnitChangeAction;
