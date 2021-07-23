import produce from 'immer';
import { Drug, PrescribedDrug, TableRowData } from '../../../types';
import {
  ALLOW_SPLITTING_UNSCORED_TABLET,
  CHOOSE_BRAND,
  CHOOSE_FORM, INTERVAL_COUNT_CHANGE, INTERVAL_END_DATE_CHANGE, INTERVAL_START_DATE_CHANGE, INTERVAL_UNIT_CHANGE,
  PRIOR_DOSAGE_CHANGE, SET_GOAL_DOSAGE,
  UPCOMING_DOSAGE_CHANGE,
} from '../../PrescriptionForm/actions';
import drugs from '../../../redux/reducers/drugs';
import { VALIDATE_INPUT_COMPLETION } from '../../../redux/actions/taperConfig';
import { TaperConfigActions } from '../../../redux/reducers/taperConfig';
import { validateCompleteInputs } from '../../../redux/reducers/utils';

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
  if (row.prescription === null) {
    return [];
  }

  if (row.form === 'capsule' || row.form === 'tablet') {
    const dosages = row.prescribedDrug.regularDosageOptions!.map((option) => ({ dosage: option, quantity: 0 }));

    Object.entries(row.prescription.data.dosage).forEach(([dosage, quantity]) => {
      dosages.find((dos) => dos.dosage === dosage)!.quantity = quantity;
    });
    return dosages;
  }

  return [{ dosage: '1mg', quantity: row.prescription.data.dosage['1mg'] }];
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
          // id..?
          allowChangePriorDosage: false,
          intervalStartDate: clickedRow.startDate!,
          intervalEndDate: clickedRow.endDate!,
          intervalUnit: clickedRow.intervalUnit!,
          intervalCount: clickedRow.intervalCount,
          priorDosages: prescriptionToDosages(prevRow),
          upcomingDosages: prescriptionToDosages(clickedRow),
          priorDosageSum: prevRow.dosage,
          upcomingDosageSum: clickedRow.dosage,
          targetDosage: prescribedDrugs?.find((drug) => drug.brand === clickedRow.brand)?.targetDosage
            || (clickedRow.changeDirection === 'decrease' ? 0 : clickedRow.dosage),
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
        drug.form = '';
        drug.allowChangePriorDosage = false;
        drug.oralDosageInfo = null;
        drug.priorDosages = [];
        drug.upcomingDosages = [];
        draft.isModalInputComplete = false;
        break;
      }

      case CHOOSE_FORM: {
        const drug = draft.prescribedDrug!;
        drug.form = action.data.form;
        drug.minDosageUnit = action.data.minDosageUnit;
        drug.priorDosages = [];
        drug.upcomingDosages = [];
        drug.oralDosageInfo = action.data.oralDosageInfo;
        drug.availableDosageOptions = action.data.availableDosageOptions;
        drug.regularDosageOptions = action.data.regularDosageOptions;
        draft.isModalInputComplete = false;
        break;
      }

      case PRIOR_DOSAGE_CHANGE: {
        const drug = draft.prescribedDrug!;
        const idx = drug.priorDosages.findIndex((curDosage) => curDosage.dosage === action.data.dosage.dosage);

        if (idx === -1) {
          drug.priorDosages.push(action.data.dosage);
        } else {
          drug.priorDosages[idx] = action.data.dosage;
        }

        drug.priorDosageSum = drug.priorDosages.reduce((prev, { dosage, quantity }) => {
          return prev + parseFloat(dosage) * quantity;
        }, 0);
        draft.isModalInputComplete = validateCompleteInputs([drug]);
        break;
      }

      case UPCOMING_DOSAGE_CHANGE: {
        const drug: PrescribedDrug = draft.prescribedDrug!;
        const idx = drug.upcomingDosages.findIndex((nextDosage) => nextDosage.dosage === action.data.dosage.dosage);

        if (idx === -1) {
          drug.upcomingDosages.push(action.data.dosage);
        } else {
          drug.upcomingDosages[idx] = action.data.dosage;
        }
        drug.upcomingDosageSum = drug.upcomingDosages.reduce((prev, { dosage, quantity }) => {
          return prev + parseFloat(dosage) * quantity;
        }, 0);

        draft.isModalInputComplete = validateCompleteInputs([drug]);

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

        draft.isModalInputComplete = validateCompleteInputs([drug]);
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
        draft.isModalInputComplete = validateCompleteInputs([drug]);
        break;
      }

      case INTERVAL_UNIT_CHANGE: {
        const drug = draft.prescribedDrug!;
        drug.intervalUnit = action.data.unit;
        drug.intervalEndDate = action.data.intervalEndDate;
        drug.intervalDurationDays = action.data.intervalDurationDays;
        draft.isModalInputComplete = validateCompleteInputs([drug]);
        break;
      }

      case VALIDATE_INPUT_COMPLETION: {
        draft.isModalInputComplete = validateCompleteInputs([draft.prescribedDrug!]);
        break;
      }
    }
  });
};

export default reducer;

export type RowEditingModalReducer = typeof reducer;
