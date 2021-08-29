import { Dispatch } from 'react';
import {
  initialState,
} from './reducer';
import {
  DrugFormNames,
  PrescriptionFormActions,
} from './actions';
import {
  PillDosage,
  Drug, DrugForm, DrugOption, OralDosage,
} from '../../types';
import { ModalActions } from '../Schedule/Modal/modalReducer';

export interface PrescriptionFormState {
  drugs: Drug[] | null;
  chosenDrug: Drug | undefined | null;
  chosenBrand: DrugOption | null;
  chosenDrugForm: DrugForm | null| undefined;
  /**
   * currentDosageForm, nextDosageForm, currentDosageOptions, nextDosageOptions:
   * used for modal when drug form is changed for next dosages
   * When drug form is changed in modal, it keeps the form and dosage of current dosage and
   * changes only those for the next dosage.
   */
  currentDosageForm: DrugFormNames | null;
  nextDosageForm: DrugFormNames | null;
  currentDosageOptions: PillDosage[] | OralDosage;
  nextDosageOptions: PillDosage[] | OralDosage;

  brandOptions: DrugOption[] | null;
  drugFormOptions: DrugForm[] | null;
  dosageOptions: PillDosage[]| OralDosage;
  /**
   * available dosage options including splitting tablet
   */
  availableDosageOptions: string[];

  /**
   * available dosage options without considering splitting tablet
   */
  regularDosageOptions: string[]|null;
  isModal: boolean;
  minDosageUnit: number;
  priorDosagesQty: { [key: string]: number };
  priorDosageSum: number;
  upcomingDosagesQty: { [key: string]: number };
  upcomingDosageSum: number;
  goalDosage: number;
  allowSplittingUnscoredTablet: boolean;
  oralDosageInfo: { rate: { mg: number, ml: number }, bottles: string[] } | null;
  intervalStartDate: Date;
  intervalEndDate: Date | null;
  intervalUnit: 'Days'|'Weeks'|'Months';
  intervalCount: number;
  intervalDurationDays: number;
  growth: 'linear' | 'exponential';
}

export type IPrescriptionFormContext = PrescriptionFormState
& {
  modal: { isModal: boolean, modalDispatch?: Dispatch<ModalActions> }
  Current: {
    dosages: typeof initialState.priorDosagesQty,
  };
  Next: {
    dosages: typeof initialState.upcomingDosagesQty,
  };
  formActionDispatch: Dispatch<PrescriptionFormActions>;
  id: number;
};
