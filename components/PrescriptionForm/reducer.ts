import {PrescriptionFormState} from "./types";
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


export type PrescriptionFormActions =
  | FetchDrugsAction
  | DrugNameChangeAction
  | ChooseBrandAction
  | ChooseFormAction
  | CurrentDosageChangeAction
  | NextDosageChangeAction

export const reducer = (state: PrescriptionFormState, action: PrescriptionFormActions): PrescriptionFormState => {
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
        const chosenDrugForm = draft.drugFormOptions!.find(form => form.form === action.data)!;
        draft.chosenDrugForm = chosenDrugForm;
        draft.dosageOptions = chosenDrugForm.dosages;
        chosenDrugForm.dosages.forEach(dosage => {
          draft.currentDosages[dosage] = 0;
          draft.nextDosages[dosage] = 0;
        });
        break;

      case CURRENT_DOSAGE_CHANGE:
        if (action.data.quantity >= 0) {
          draft.currentDosages[action.data.dosage] = action.data.quantity;
        }
        break;

      case NEXT_DOSAGE_CHANGE:
        if (!(action.data.quantity < 0)) {
          draft.nextDosages[action.data.dosage] = action.data.quantity;
        }
        break;

      default:
        return state;
    }
  })
}

export type PrescriptionFormReducer = typeof reducer;
