import {PrescriptionFormState} from "./PrescriptionForm";
import {Drug} from "../../types";
import produce from "immer";

export const initialState: PrescriptionFormState = {
  drugs: null,
  chosenDrug: null,
  chosenBrand: null,
  chosenDrugForm: null,
  brandOptions: [],
  drugFormOptions: [],
  dosageOptions: [],
  currentDosages: {},
  nextDosages: {},
}

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

export interface CurrentDosageChange {
  type: typeof CURRENT_DOSAGE_CHANGE;
  data: string;
}

export const NEXT_DOSAGE_CHANGE = "NEXT_DOSAGE_CHANGE" as const;

export interface NextDosageChangeAction {
  type: typeof NEXT_DOSAGE_CHANGE;
  data: string;
}

export type PrescriptionFormActions =
  | FetchDrugsAction
  | DrugNameChangeAction
  | ChooseBrandAction
  | ChooseFormAction
  | CurrentDosageChange
  | NextDosageChangeAction

export type PrescriptionFormReducer = (prevState: PrescriptionFormState, action: PrescriptionFormActions) => PrescriptionFormState;

export const reducer: PrescriptionFormReducer = (state: PrescriptionFormState, action: PrescriptionFormActions): PrescriptionFormState => {
  return produce(state, draft => {
    switch (action.type) {
      case FETCH_DRUGS:
        draft.drugs = action.data;
        break;

      case DRUG_NAME_CHANGE:
        const newDrug = draft.drugs!.find(drug => drug.name === action.data)!;
        draft.chosenDrug = newDrug;
        draft.chosenBrand = null;
        draft.chosenDrugForm = null;
        draft.drugFormOptions = [];
        draft.brandOptions = newDrug.options;
        break;

      case CHOOSE_BRAND:
        const chosenBrandOption = draft.brandOptions!.find(brand => brand.brand === action.data)!;
        draft.chosenBrand = chosenBrandOption;
        draft.drugFormOptions = chosenBrandOption.forms;
        break;

      case CHOOSE_FORM:
        draft.chosenDrugForm = draft.drugFormOptions!.find(form => form.form === action.data);
        break;

      case CURRENT_DOSAGE_CHANGE:
        break;

      case NEXT_DOSAGE_CHANGE:
        break;

      default:
        return state;
    }
  })
}
