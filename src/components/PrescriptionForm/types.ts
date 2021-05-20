import { Dispatch } from 'react';
import {
  initialState,
} from './reducer';
import {
  priorDosageChange,
  upcomingDosageChange,
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
  priorDosagesQty: { [key: string]: number };
  upcomingDosagesQty: { [key: string]: number };
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
  Prior: {
    dosages: typeof initialState.priorDosagesQty,
    dosageChangeAction: typeof priorDosageChange,
  };
  Upcoming: {
    dosages: typeof initialState.upcomingDosagesQty,
    dosageChangeAction: typeof upcomingDosageChange,
  };
  formActionDispatch: Dispatch<PrescriptionFormActions>;
  id: number;
};
