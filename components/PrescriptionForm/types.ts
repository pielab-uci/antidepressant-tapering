import {Drug, DrugOption, DrugForm} from "../../types";
import {
  CurrentDosageChangeAction,
  initialState,
  NextDosageChangeAction,
  PrescriptionFormActions
} from "./reducer";
import {Dispatch} from "react";

export interface PrescriptionFormState {
  chosenDrug: Drug | undefined | null;
  chosenBrand: DrugOption | null;
  chosenDrugForm: DrugForm | null | undefined;
  brandOptions: DrugOption[] | null;
  drugFormOptions: DrugForm[] | null;
  dosageOptions: string[];
  currentDosages: { [key: string]: number };
  nextDosages: { [key: string]: number };
  drugs: Drug[] | null;
}

export interface IPrescriptionFormContext {
  Current: { dosages: typeof initialState.currentDosages, action: (data: {dosage: string, quantity: number}) => CurrentDosageChangeAction};
  Next: { dosages: typeof initialState.nextDosages, action: (data: {dosage: string, quantity: number}) => NextDosageChangeAction};
  chosenDrugForm: DrugForm | null | undefined;
  currentDosages: typeof initialState.currentDosages;
  nextDosages: typeof initialState.nextDosages;
  dosageOptions: string[];
  dispatch: Dispatch<PrescriptionFormActions>;
}

