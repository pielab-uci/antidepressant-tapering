import produce from 'immer';
import { Drug, PrescribedDrug, TableRowData } from '../../../types';
import {
  ALLOW_SPLITTING_UNSCORED_TABLET,
  CHOOSE_BRAND,
  CHOOSE_FORM,
  INTERVAL_COUNT_CHANGE,
  INTERVAL_END_DATE_CHANGE,
  INTERVAL_START_DATE_CHANGE,
  INTERVAL_UNIT_CHANGE,
  CURRENT_DOSAGE_CHANGE,
  SET_GOAL_DOSAGE,
  NEXT_DOSAGE_CHANGE,
} from '../../PrescriptionForm/actions';
import drugs from '../../../redux/reducers/drugs';
import {
  EDIT_PROJECTED_SCHEDULE_FROM_MODAL,
  SET_IS_INPUT_COMPLETE,
  VALIDATE_INPUT_COMPLETION,
} from '../../../redux/actions/taperConfig';
import { TaperConfigActions } from '../../../redux/reducers/taperConfig';
import { validateCompleteInputs } from '../../../utils/taperConfig';

export const INIT_MODAL = 'INIT_MODAL';

export interface InitModalAction {
  type: typeof INIT_MODAL;
  data: { prevRow: TableRowData; clickedRow: TableRowData, prescribedDrugs: PrescribedDrug[] | null }
}

export type ModalActions =
  | TaperConfigActions
  | InitModalAction;

export interface RowEditingModalState {
  drugs: Drug[];
  prescribedDrug: PrescribedDrug | null;
  initialPrescribedDrug: PrescribedDrug | null;
  prescribedDrugs: PrescribedDrug[] | null;
  isModalInputComplete: boolean;
}

export const initialState: RowEditingModalState = {
  drugs,
  initialPrescribedDrug: null,
  prescribedDrug: null,
  prescribedDrugs: null,
  isModalInputComplete: true,
};

const prescriptionToDosages = (row: TableRowData): { dosage: string, quantity: number }[] => {
  if (row.form === 'capsule' || row.form === 'tablet') {
    if (row.prescription === null) {
      return [];
    }
    const dosages = row.prescribedDrug.regularDosageOptions!.map((option) => ({ dosage: option, quantity: 0 }));

    Object.entries(row.prescription.data.dosage).forEach(([dosage, quantity]) => {
      dosages.find((dos) => dos.dosage === dosage)!.quantity = quantity;
    });
    return dosages;
  }

  return [{ dosage: '1mg', quantity: row.dosage }];
};

const isModalInputComplete = (drug: PrescribedDrug): boolean => {
  return drug.name !== ''
    && drug.brand !== ''
    && drug.form !== null
    && drug.intervalEndDate !== null
    && drug.intervalCount !== 0
    && drug.nextDosages.length !== 0
    && !drug.nextDosages.every((dosage) => dosage.quantity === 0);
};

const reducer = (state: RowEditingModalState = initialState, action: ModalActions): RowEditingModalState => {
  console.log('modalAction: ', action);
  return produce(state, (draft) => {
    switch (action.type) {
      case INIT_MODAL: {
        const { prevRow, clickedRow, prescribedDrugs } = action.data;

        draft.prescribedDrug = {
          ...clickedRow.prescribedDrug,
          isModal: true,
          applyInSchedule: false,
          currentDosageForm: prevRow.nextDosageForm,
          nextDosageForm: clickedRow.nextDosageForm,
          // id..?
          allowChangePriorDosage: false,
          intervalStartDate: clickedRow.startDate!,
          intervalEndDate: clickedRow.endDate!,
          intervalUnit: clickedRow.intervalUnit!,
          intervalCount: clickedRow.intervalCount,
          currentDosages: prescriptionToDosages(prevRow),
          nextDosages: prescriptionToDosages(clickedRow),
          currentOralDosageInfo: clickedRow.currentOralDosageInfo,
          nextOralDosageInfo: clickedRow.nextOralDosageInfo,
          currentDosageSum: prevRow.dosage,
          nextDosageSum: clickedRow.dosage,
          // targetDosage: prescribedDrugs?.find((drug) => drug.brand === clickedRow.brand)?.targetDosage
          //   || (clickedRow.changeDirection === 'decrease' ? 0 : clickedRow.dosage),
          targetDosage: clickedRow.goalDosage,
        };

        draft.initialPrescribedDrug = { ...draft.prescribedDrug };
        break;
      }

      case CHOOSE_BRAND: {
        const correspondingDrugData = draft.drugs.find((d) => d.options.find((option) => option.brand === action.data.brand))!;
        const drug = draft.prescribedDrug!;
        drug.name = correspondingDrugData.name;
        drug.halfLife = correspondingDrugData.halfLife;
        drug.brand = action.data.brand;
        drug.form = null;
        drug.currentDosageForm = null;
        drug.nextDosageForm = null;
        drug.allowChangePriorDosage = false;
        drug.oralDosageInfo = null;
        // drug.currentOralDosageInfo = null;
        drug.nextOralDosageInfo = null;
        drug.currentDosages = [];
        drug.nextDosages = [];
        draft.isModalInputComplete = false;
        break;
      }

      case CHOOSE_FORM: {
        const drug = draft.prescribedDrug!;
        drug.form = action.data.form;
        if (drug.currentDosageForm === null) {
          drug.currentDosageForm = action.data.form;
        }
        drug.nextDosageForm = action.data.form;
        drug.minDosageUnit = action.data.minDosageUnit;
        // drug.currentDosages = [];
        drug.nextDosages = [];

        if (action.data.oralDosageInfo === null) {
          if (drug.currentDosageForm !== 'oral solution' && drug.currentDosageForm !== 'oral suspension') {
            drug.oralDosageInfo = action.data.oralDosageInfo;
          }
        } else {
          drug.oralDosageInfo = action.data.oralDosageInfo;
          drug.nextOralDosageInfo = action.data.oralDosageInfo;
        }
        // if (drug.currentDosageForm !== 'oral solution' && drug.currentDosageForm !== 'oral suspension'
        //   && drug.nextDosageForm !== 'oral solution' && drug.nextDosageForm !== 'oral suspension') {
        //   drug.oralDosageInfo = action.data.oralDosageInfo;
        // }
        drug.availableDosageOptions = action.data.availableDosageOptions;
        drug.regularDosageOptions = action.data.regularDosageOptions;
        draft.isModalInputComplete = false;
        break;
      }

      case CURRENT_DOSAGE_CHANGE: {
        const drug = draft.prescribedDrug!;
        const idx = drug.currentDosages.findIndex((curDosage) => curDosage.dosage === action.data.dosage.dosage);

        if (idx === -1) {
          drug.currentDosages.push(action.data.dosage);
        } else {
          drug.currentDosages[idx] = action.data.dosage;
        }

        drug.currentDosageSum = drug.currentDosages.reduce((prev, { dosage, quantity }) => {
          return prev + parseFloat(dosage) * quantity;
        }, 0);
        draft.isModalInputComplete = validateCompleteInputs([drug], isModalInputComplete);
        break;
      }

      case NEXT_DOSAGE_CHANGE: {
        const drug: PrescribedDrug = draft.prescribedDrug!;
        const idx = drug.nextDosages.findIndex((nextDosage) => nextDosage.dosage === action.data.dosage.dosage);

        if (idx === -1) {
          drug.nextDosages.push(action.data.dosage);
        } else {
          drug.nextDosages[idx] = action.data.dosage;
        }
        drug.nextDosageSum = drug.nextDosages.reduce((prev, { dosage, quantity }) => {
          return prev + parseFloat(dosage) * quantity;
        }, 0);

        draft.isModalInputComplete = validateCompleteInputs([drug], isModalInputComplete);

        break;
      }

      case SET_GOAL_DOSAGE:
        draft.prescribedDrug!.targetDosage = action.data.dosage;
        break;

      case ALLOW_SPLITTING_UNSCORED_TABLET:
        draft.prescribedDrug!.allowSplittingUnscoredTablet = action.data.allow;
        break;

      case INTERVAL_START_DATE_CHANGE: {
        const drug = draft.prescribedDrug!;
        drug.intervalStartDate = action.data.intervalStartDate;
        drug.intervalEndDate = action.data.intervalEndDate || drug.intervalEndDate;
        drug.intervalDurationDays = action.data.intervalDurationDays || drug.intervalDurationDays;
        drug.intervalUnit = action.data.intervalUnit || drug.intervalUnit;
        drug.intervalCount = action.data.intervalCount || drug.intervalCount;

        draft.isModalInputComplete = validateCompleteInputs([drug], isModalInputComplete);
        break;
      }

      case INTERVAL_END_DATE_CHANGE: {
        const drug = draft.prescribedDrug!;
        drug.intervalEndDate = action.data.intervalEndDate;
        drug.intervalStartDate = action.data.intervalStartDate || drug.intervalStartDate;
        drug.intervalCount = action.data.intervalCount || drug.intervalCount;
        drug.intervalUnit = action.data.intervalUnit || drug.intervalUnit;
        drug.intervalDurationDays = action.data.intervalDurationDays || drug.intervalDurationDays;
        break;
      }

      case INTERVAL_COUNT_CHANGE: {
        const drug = draft.prescribedDrug!;
        drug.intervalCount = action.data.count;
        drug.intervalEndDate = action.data.intervalEndDate;
        drug.intervalDurationDays = action.data.intervalDurationDays;
        draft.isModalInputComplete = validateCompleteInputs([drug], isModalInputComplete);
        break;
      }

      case INTERVAL_UNIT_CHANGE: {
        const drug = draft.prescribedDrug!;
        drug.intervalUnit = action.data.unit;
        drug.intervalEndDate = action.data.intervalEndDate;
        drug.intervalDurationDays = action.data.intervalDurationDays;
        draft.isModalInputComplete = validateCompleteInputs([drug], isModalInputComplete);
        break;
      }

      case VALIDATE_INPUT_COMPLETION: {
        draft.isModalInputComplete = validateCompleteInputs([draft.prescribedDrug!], isModalInputComplete) && action.data!.isGoalDosageValid;
        break;
      }

      case SET_IS_INPUT_COMPLETE:
        draft.isModalInputComplete = action.data.isComplete;
    }
  });
};

export default reducer;

export type RowEditingModalReducer = typeof reducer;
