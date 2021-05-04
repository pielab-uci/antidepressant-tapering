import { Dispatch } from 'react';
import { Drug, DrugOption, DrugForm } from '../../types';
import {
  initialState,
} from './reducer';
import {
  CurrentDosageChangeAction,
  NextDosageChangeAction,
  PrescriptionFormActions,
} from './actions';

export interface PrescriptionFormState {
  drugs: Drug[] | null;
  chosenDrug: Drug | undefined | null;
  chosenBrand: DrugOption | null;
  chosenDrugForm: DrugForm | null | undefined;
  brandOptions: DrugOption[] | null;
  drugFormOptions: DrugForm[] | null;
  dosageOptions: string[];
  currentDosagesQty: { [key: string]: number };
  nextDosagesQty: { [key: string]: number };
  prescribedDosagesQty: { [key: string]: number };
  intervalUnit: 'Days'|'Weeks'|'Months';
  intervalCount: number;
  intervalStartDate: Date;
  intervalEndDate: Date | null;
  intervalDurationDays: number;
}

export type IPrescriptionFormContext = PrescriptionFormState
& {
  Current: {
    dosages: typeof initialState.currentDosagesQty,
    action: (data: { id: number, dosage: { dosage: string, quantity: number } })
    => CurrentDosageChangeAction
  };
  Next: {
    dosages: typeof initialState.nextDosagesQty,
    action: (data: { id: number, dosage: { dosage: string, quantity: number } })
    => NextDosageChangeAction
  };
  dispatch: Dispatch<PrescriptionFormActions>;
  id: number;
};
