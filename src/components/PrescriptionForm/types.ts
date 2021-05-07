import { Dispatch } from 'react';
import {
  initialState,
} from './reducer';
import {
  currentDosageChange,
  nextDosageChange,
  PrescriptionFormActions,
} from './actions';

export interface Drug {
  name: string;
  options: DrugOption[]
}

export interface DrugOption {
  brand: string;
  forms: DrugForm[]
}

export interface DrugForm {
  form: string;
  isCuttable: boolean;
  measureUnit: string;
  dosages: string[]
}

export interface PrescriptionFormState {
  drugs: Drug[] | null;
  chosenDrug: Drug | undefined | null;
  chosenBrand: DrugOption | null;
  chosenDrugForm: DrugForm | null | undefined;
  brandOptions: DrugOption[] | null;
  drugFormOptions: DrugForm[] | null;
  dosageOptions: string[];
  minDosageUnit: number;
  currentDosagesQty: { [key: string]: number };
  nextDosagesQty: { [key: string]: number };
  prescribedDosagesQty: { [key: string]: number };
  intervalStartDate: Date;
  intervalEndDate: Date | null;
  intervalUnit: 'Days'|'Weeks'|'Months';
  intervalCount: number;
  intervalDurationDays: number;
}

// TODO: update Current, Next depending on changing form
export type IPrescriptionFormContext = PrescriptionFormState
& {
  Current: {
    dosages: typeof initialState.currentDosagesQty,
    action: typeof currentDosageChange
  };
  Next: {
    dosages: typeof initialState.nextDosagesQty,
    action: typeof nextDosageChange
  };
  formActionDispatch: Dispatch<PrescriptionFormActions>;
  id: number;
};
