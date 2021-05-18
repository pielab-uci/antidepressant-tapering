import { Dispatch } from 'react';
import {
  initialState,
} from './reducer';
import {
  currentDosageChange,
  nextDosageChange,
  PrescriptionFormActions,
} from './actions';
import { Drug, DrugForm, DrugOption } from '../../types';

export interface PrescriptionFormState {
  drugs: Drug[] | null;
  chosenDrug: Drug | undefined | null;
  chosenBrand: DrugOption | null;
  chosenDrugForm: DrugForm | null | undefined;
  brandOptions: DrugOption[] | null;
  drugFormOptions: DrugForm[] | null;
  dosageOptions: { dosage: string, isScored?: boolean }[];
  availableDosageOptions: string[];
  minDosageUnit: number;
  currentDosagesQty: { [key: string]: number };
  nextDosagesQty: { [key: string]: number };
  allowSplittingUnscoredTablet: boolean;
  prescribedDosagesQty: { [key: string]: number };
  intervalStartDate: Date;
  intervalEndDate: Date | null;
  intervalUnit: 'Days'|'Weeks'|'Months';
  intervalCount: number;
  intervalDurationDays: number;
}

export type IPrescriptionFormContext = PrescriptionFormState
& {
  Current: {
    dosages: typeof initialState.currentDosagesQty,
    dosageChangeAction: typeof currentDosageChange,
  };
  Next: {
    dosages: typeof initialState.nextDosagesQty,
    dosageChangeAction: typeof nextDosageChange,
  };
  formActionDispatch: Dispatch<PrescriptionFormActions>;
  id: number;
};
