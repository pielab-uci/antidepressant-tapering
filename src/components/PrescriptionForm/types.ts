import { Dispatch } from 'react';
import {
  initialState,
} from './reducer';
import {
  currentAllowSplittingUnscoredDosageUnit,
  currentDosageChange, nextAllowSplittingUnscoredDosageUnit,
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
  currentDosageAllowSplittingUnscoredUnit: boolean;
  nextDosageAllowSplittingUnscoredUnit: boolean; // TODO: what about bottle of oral solution..?
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
    allowSplittingUnscored: typeof initialState.currentDosageAllowSplittingUnscoredUnit,
    dosageChangeAction: typeof currentDosageChange,
    toggleAllowSplittingUnscored: typeof currentAllowSplittingUnscoredDosageUnit
  };
  Next: {
    dosages: typeof initialState.nextDosagesQty,
    allowSplittingUnscored: typeof initialState.nextDosageAllowSplittingUnscoredUnit,
    dosageChangeAction: typeof nextDosageChange,
    toggleAllowSplittingUnscored: typeof nextAllowSplittingUnscoredDosageUnit
  };
  formActionDispatch: Dispatch<PrescriptionFormActions>;
  id: number;
};
