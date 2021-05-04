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
  currentDosages: { [key: string]: number };
  nextDosages: { [key: string]: number };
  intervalUnit: 'Days'|'Weeks'|'Months';
  intervalCount: number;
  intervalStartDate: Date;
  intervalEndDate: Date | null;
}

export type IPrescriptionFormContext = PrescriptionFormState
& {
  Current: {
    dosages: typeof initialState.currentDosages,
    action: (data: { id: number, dosage: { dosage: string, quantity: number } })
    => CurrentDosageChangeAction
  };
  Next: {
    dosages: typeof initialState.nextDosages,
    action: (data: { id: number, dosage: { dosage: string, quantity: number } })
    => NextDosageChangeAction
  };
  dispatch: Dispatch<PrescriptionFormActions>;
  id: number;
};
