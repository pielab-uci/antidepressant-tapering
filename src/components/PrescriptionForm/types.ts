import { Dispatch } from 'react';
import {
  initialState,
} from './reducer';
import {
  priorDosageChange,
  upcomingDosageChange,
  PrescriptionFormActions,
} from './actions';
import {
  CapsuleOrTabletDosage,
  Drug, DrugForm, DrugOption, OralDosage,
} from '../../types';

export interface PrescriptionFormState {
  drugs: Drug[] | null;
  chosenDrug: Drug | undefined | null;
  chosenBrand: DrugOption | null;
  chosenDrugForm: DrugForm | null| undefined;
  brandOptions: DrugOption[] | null;
  drugFormOptions: DrugForm[] | null;
  dosageOptions: CapsuleOrTabletDosage[]| OralDosage;
  availableDosageOptions: string[];
  minDosageUnit: number;
  priorDosagesQty: { [key: string]: number };
  upcomingDosagesQty: { [key: string]: number };
  allowSplittingUnscoredTablet: boolean;
  prescribedDosagesQty: { [key: string]: number };
  oralDosageInfo: { rate: { mg: number, ml: number }, bottles: string[] } | null;
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
