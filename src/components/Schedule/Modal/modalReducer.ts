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

export const POPULATE_PRESCRIBED_DRUG_FROM_DOUBLE_CLICKED_ROW_AND_BEFORE = 'POPULATE_PRESCRIBED_DRUG_FROM_DOUBLE_CLICKED_ROW_AND_BEFORE';
export interface PopulatePrescribedDrug {
  type: typeof POPULATE_PRESCRIBED_DRUG_FROM_DOUBLE_CLICKED_ROW_AND_BEFORE;
  data: { prevRow: TableRowData; doubleClickedRow: TableRowData }
}

export type ModalActions =
  | TaperConfigActions
  | PopulatePrescribedDrug;

export interface RowEditingModalState {
  drugs: Drug[];
  prescribedDrug: PrescribedDrug | null;
  isModalInputComplete: boolean;
}

export const initialState: RowEditingModalState = {
  drugs,
  prescribedDrug: null,
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
      case POPULATE_PRESCRIBED_DRUG_FROM_DOUBLE_CLICKED_ROW_AND_BEFORE: {
        const { prevRow } = action.data;
        const { doubleClickedRow } = action.data;

        const priorDosageSum = (action.data.prevRow.prescription
        && Object.entries(action.data.prevRow.prescription.data.dosage)
          .reduce((prev, [dosage, qty]) => prev + parseFloat(dosage) * qty, 0)) || 0;

        const upcomingDosageSum = (action.data.doubleClickedRow.prescription
        && Object.entries(action.data.doubleClickedRow.prescription.data.dosage)
          .reduce((prev, [dosage, qty]) => prev + parseFloat(dosage) * qty, 0)) || 0;

        draft.prescribedDrug = {
          ...doubleClickedRow.prescribedDrug,
          isModal: true,
          applyInSchedule: false,
          // id..?
          allowChangePriorDosage: false,
          intervalStartDate: doubleClickedRow.startDate!,
          intervalEndDate: doubleClickedRow.endDate!,
          intervalUnit: doubleClickedRow.intervalUnit!,
          intervalCount: doubleClickedRow.intervalCount,
          priorDosages: prescriptionToDosages(prevRow),
          upcomingDosages: prescriptionToDosages(doubleClickedRow),
          priorDosageSum,
          upcomingDosageSum,
          targetDosage: upcomingDosageSum,
        };
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
        draft.isModalInputComplete = validateCompleteInputs([drug]);
        break;
      }

      case UPCOMING_DOSAGE_CHANGE: {
        const drug = draft.prescribedDrug!;
        const idx = drug.upcomingDosages.findIndex((nextDosage) => nextDosage.dosage === action.data.dosage.dosage);

        if (idx === -1) {
          drug.upcomingDosages.push(action.data.dosage);
        } else {
          drug.upcomingDosages[idx] = action.data.dosage;
        }
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
        drug.intervalStartDate = new Date(action.data.date.valueOf() + action.data.date.getTimezoneOffset() * 60 * 1000);

        if (drug.intervalEndDate) {
          drug.intervalUnit = 'Days';
          drug.intervalCount = action.data.intervalDurationDays;
          drug.intervalDurationDays = action.data.intervalDurationDays;
        }
        draft.isModalInputComplete = validateCompleteInputs([drug]);
        break;
      }

      case INTERVAL_END_DATE_CHANGE: {
        const drug = draft.prescribedDrug!;
        drug.intervalEndDate = action.data.date;
        drug.intervalUnit = 'Days';
        drug.intervalCount = action.data.intervalDurationDays;
        drug.intervalDurationDays = action.data.intervalDurationDays;
        draft.isModalInputComplete = validateCompleteInputs([drug]);
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
