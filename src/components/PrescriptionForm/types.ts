import { Dispatch } from 'react';
import {
  initialState,
} from './reducer';
import {
  PrescriptionFormActions,
} from './actions';
import {
  CapsuleOrTabletDosage,
  Drug, DrugForm, DrugOption, OralDosage,
} from '../../types';
import { ModalActions } from '../Schedule/Modal/modalReducer';

export interface PrescriptionFormState {
  drugs: Drug[] | null;
  chosenDrug: Drug | undefined | null;
  chosenBrand: DrugOption | null;
  chosenDrugForm: DrugForm | null| undefined;
  brandOptions: DrugOption[] | null;
  drugFormOptions: DrugForm[] | null;
  dosageOptions: CapsuleOrTabletDosage[]| OralDosage;
  availableDosageOptions: string[];
  regularDosageOptions: string[]|null;
  minDosageUnit: number;
  priorDosagesQty: { [key: string]: number };
  priorDosageSum: number;
  upcomingDosagesQty: { [key: string]: number };
  upcomingDosageSum: number;
  targetDosage: number;
  allowSplittingUnscoredTablet: boolean;
  oralDosageInfo: { rate: { mg: number, ml: number }, bottles: string[] } | null;
  intervalStartDate: Date;
  intervalEndDate: Date | null;
  intervalUnit: 'Days'|'Weeks'|'Months';
  intervalCount: number;
  intervalDurationDays: number;
}

export type IPrescriptionFormContext = PrescriptionFormState
& {
  modal: { isModal: boolean, modalDispatch?: Dispatch<ModalActions> }
  Prior: {
    dosages: typeof initialState.priorDosagesQty,
  };
  Upcoming: {
    dosages: typeof initialState.upcomingDosagesQty,
  };
  formActionDispatch: Dispatch<PrescriptionFormActions>;
  id: number;
};
