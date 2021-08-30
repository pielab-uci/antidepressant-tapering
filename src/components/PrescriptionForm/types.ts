import { Dispatch } from 'react';
import {
  initialState,
} from './reducer';
import {
  PrescriptionFormActions,
} from './actions';
import {
  PillDosage, Drug, DrugForm, DrugFormNames, DrugOption, OralDosage,
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
  currentDosagesQty: { [key: string]: number };
  currentDosageSum: number;
  nextDosagesQty: { [key: string]: number };
  nextDosageSum: number;
  goalDosage: number;
  allowSplittingUnscoredTablet: boolean;
  oralDosageInfo: OralDosage | null;
  currentOralDosageInfo: OralDosage | null;
  nextOralDosageInfo: OralDosage | null;
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
    dosages: typeof initialState.currentDosagesQty,
  };
  Next: {
    dosages: typeof initialState.nextDosagesQty,
  };
  formActionDispatch: Dispatch<PrescriptionFormActions>;
  id: number;
};
