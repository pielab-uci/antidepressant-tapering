import produce from 'immer';
import differenceInCalendarDays from 'date-fns/esm/differenceInCalendarDays';
import {
  ADD_NEW_DRUG_FORM,
  CHANGE_MESSAGE_FOR_PATIENT,
  CHANGE_NOTE_AND_INSTRUCTIONS,
  CLEAR_SCHEDULE,
  EDIT_PROJECTED_SCHEDULE_FROM_MODAL,
  EMPTY_PRESCRIBED_DRUGS,
  EMPTY_TAPER_CONFIG_PAGE,
  FINAL_PRESCRIPTION_QUANTITY_CHANGE,
  GENERATE_SCHEDULE,
  INIT_NEW_TAPER_CONFIG,
  REMOVE_DRUG_FORM,
  SCHEDULE_ROW_SELECTED,
  SET_IS_INPUT_COMPLETE,
  TABLE_DOSAGE_EDITED,
  TABLE_END_DATE_EDITED,
  TABLE_START_DATE_EDITED,
  TOGGLE_SHARE_PROJECTED_SCHEDULE_WITH_PATIENT,
  UPDATE_CHART,
  VALIDATE_INPUT_COMPLETION,
} from '../../actions/taperConfig';

import {
  ALLOW_SPLITTING_UNSCORED_TABLET,
  CHOOSE_BRAND,
  CHOOSE_FORM,
  INTERVAL_COUNT_CHANGE,
  INTERVAL_END_DATE_CHANGE,
  INTERVAL_START_DATE_CHANGE,
  INTERVAL_UNIT_CHANGE,
  PrescriptionFormActions,
  PRIOR_DOSAGE_CHANGE,
  SET_TARGET_DOSAGE,
  UPCOMING_DOSAGE_CHANGE,
} from '../../../components/PrescriptionForm/actions';
import {
  calcFinalPrescription,
  calcMinimumQuantityForDosage,
  chartDataConverter,
  generateInstructionsForPatientFromSchedule,
  generateInstructionsForPharmacy,
  isCompleteDrugInput,
  prescription,
  ScheduleChartData,
  scheduleGenerator,
  validateCompleteInputs,
} from '../utils';
import {
  TaperConfigState, TaperConfigActions, emptyPrescribedDrug, initialState,
} from './index';

const taperConfigReducer = (state: TaperConfigState = initialState, action: TaperConfigActions) => {
  console.log('taperConfigAction: ', action);
  return produce(state, (draft) => {
    switch (action.type) {
      case INIT_NEW_TAPER_CONFIG:
        draft.clinicianId = action.data.clinicianId;
        draft.patientId = action.data.patientId;
        draft.taperConfigCreatedAt = null;
        draft.lastPrescriptionFormId += 1;
        draft.prescribedDrugs = [emptyPrescribedDrug(draft.lastPrescriptionFormId)];
        draft.isSaved = false;
        draft.isInputComplete = false;
        break;

      case EMPTY_TAPER_CONFIG_PAGE:
        draft.taperConfigId = null;
        draft.taperConfigCreatedAt = null;
        draft.scheduleChartData = [];
        draft.isInputComplete = false;
        draft.prescribedDrugs = draft.prescribedDrugs!.filter((drug) => isCompleteDrugInput(drug));
        draft.projectedSchedule = { drugs: [], data: [] };
        draft.instructionsForPatient = '';
        draft.instructionsForPharmacy = '';
        break;

      case EMPTY_PRESCRIBED_DRUGS:
        draft.isInputComplete = false;
        draft.prescribedDrugs = null;
        draft.projectedSchedule = { drugs: [], data: [] };
        draft.instructionsForPatient = '';
        draft.instructionsForPharmacy = '';
        draft.scheduleChartData = [];
        break;

      case ADD_NEW_DRUG_FORM:
        if (action.data === null) {
          draft.prescriptionFormIds.push(draft.lastPrescriptionFormId + 1);
          draft.prescribedDrugs!.push(emptyPrescribedDrug(draft.lastPrescriptionFormId + 1));
          draft.isInputComplete = false;
          draft.lastPrescriptionFormId += 1;
          draft.showInstructionsForPatient = false;
          draft.isSaved = false;
        } else {
          // change these on click ok in modal
          // draft.prescriptionFormIds.push(action.data.id);
          // draft.lastPrescriptionFormId = action.data.id;

          draft.prescribedDrugs!.push(action.data);
        }
        break;

      case REMOVE_DRUG_FORM:
        // draft.prescriptionFormIds = draft.prescriptionFormIds.filter((id) => id !== action.data);
        // draft.prescribedDrugs = draft.prescribedDrugs!.filter((drug) => drug.id !== action.data);
        draft.prescriptionFormIds.pop();
        draft.prescribedDrugs!.pop();
        draft.isSaved = false;
        draft.isInputComplete = validateCompleteInputs(draft.prescribedDrugs);
        break;

      case GENERATE_SCHEDULE: {
        draft.projectedSchedule = scheduleGenerator(action.data);
        draft.scheduleChartData = chartDataConverter(draft.projectedSchedule);
        draft.instructionsForPatient = generateInstructionsForPatientFromSchedule(draft.projectedSchedule);
        draft.instructionsForPharmacy = generateInstructionsForPharmacy(draft.instructionsForPatient, draft.finalPrescription);
        draft.showInstructionsForPatient = true;
        draft.isSaved = false;
        break;
      }

      case CLEAR_SCHEDULE:
        draft.projectedSchedule = { data: [], drugs: [] };
        draft.scheduleChartData = [];
        draft.showInstructionsForPatient = false;
        draft.instructionsForPharmacy = '';
        draft.instructionsForPatient = '';
        draft.isSaved = false;
        break;

      case UPDATE_CHART:
        draft.scheduleChartData = chartDataConverter(draft.projectedSchedule);
        break;

      case SCHEDULE_ROW_SELECTED: {
        draft.tableSelectedRows = action.data;
        draft.projectedSchedule.data.forEach((row, i) => {
          row.selected = draft.tableSelectedRows.includes(i);
        });
        draft.instructionsForPatient = generateInstructionsForPatientFromSchedule(draft.projectedSchedule);
        draft.finalPrescription = calcFinalPrescription(draft.projectedSchedule.data, draft.tableSelectedRows);
        draft.instructionsForPharmacy = generateInstructionsForPharmacy(draft.instructionsForPatient, draft.finalPrescription);
        break;
      }

      case FINAL_PRESCRIPTION_QUANTITY_CHANGE:
        draft.finalPrescription[action.data.id].dosageQty[action.data.dosage] = action.data.quantity;
        draft.instructionsForPharmacy = generateInstructionsForPharmacy(draft.instructionsForPatient, draft.finalPrescription);
        draft.isSaved = false;
        break;

      case CHANGE_MESSAGE_FOR_PATIENT:
        draft.instructionsForPatient = action.data;
        break;

      case CHANGE_NOTE_AND_INSTRUCTIONS:
        draft.instructionsForPharmacy = action.data;
        break;

      case TOGGLE_SHARE_PROJECTED_SCHEDULE_WITH_PATIENT:
        draft.shareProjectedScheduleWithPatient = !draft.shareProjectedScheduleWithPatient;
        break;

      case CHOOSE_BRAND: {
        const drug = draft.prescribedDrugs!.find((d) => d.id === action.data.id)!;
        const correspondingDrugData = draft.drugs.find((d) => d.options.find((option) => option.brand === action.data.brand))!;
        drug.name = correspondingDrugData.name;
        drug.halfLife = correspondingDrugData.halfLife;
        // drug.name = draft.drugs.find(
        //   (d) => d.options.find(
        //     (option) => option.brand === action.data.brand,
        //   ),
        // )!.name;
        drug.brand = action.data.brand;
        drug.form = '';
        drug.allowChangePriorDosage = true;
        drug.oralDosageInfo = null;
        drug.priorDosages = [];
        drug.upcomingDosages = [];
        draft.isInputComplete = false;
        draft.isSaved = false;
        draft.instructionsForPatient = '';
        draft.instructionsForPharmacy = '';
        draft.showInstructionsForPatient = false;
        break;
      }

      case CHOOSE_FORM: {
        const drug = draft.prescribedDrugs!.find((d) => d.id === action.data.id)!;
        drug.form = action.data.form;
        drug.minDosageUnit = action.data.minDosageUnit;
        drug.priorDosages = [];
        drug.upcomingDosages = [];
        drug.oralDosageInfo = action.data.oralDosageInfo;
        drug.availableDosageOptions = action.data.availableDosageOptions;
        drug.regularDosageOptions = action.data.regularDosageOptions;
        draft.isInputComplete = false;
        draft.isSaved = false;
        draft.instructionsForPatient = '';
        draft.instructionsForPharmacy = '';
        break;
      }

      case PRIOR_DOSAGE_CHANGE: {
        const drug = draft.prescribedDrugs!.find((d) => d.id === action.data.id)!;
        const idx = drug.priorDosages.findIndex(
          (curDosage) => curDosage.dosage === action.data.dosage.dosage,
        );

        if (idx === -1) {
          drug.priorDosages.push(action.data.dosage);
        } else {
          drug.priorDosages[idx] = action.data.dosage;
        }
        draft.isSaved = false;
        draft.isInputComplete = validateCompleteInputs(draft.prescribedDrugs);
        break;
      }

      case UPCOMING_DOSAGE_CHANGE: {
        const drug = draft.prescribedDrugs!.find((d) => d.id === action.data.id)!;
        const idx = drug.upcomingDosages.findIndex(
          (nextDosage) => nextDosage.dosage === action.data.dosage.dosage,
        );

        if (idx === -1) {
          drug.upcomingDosages.push(action.data.dosage);
        } else {
          drug.upcomingDosages[idx] = action.data.dosage;
        }
        draft.isInputComplete = validateCompleteInputs(draft.prescribedDrugs);
        draft.isSaved = false;
        break;
      }

      case SET_TARGET_DOSAGE: {
        const drug = draft.prescribedDrugs!.find((d) => d.id === action.data.id)!;
        drug.targetDosage = action.data.dosage;
        break;
      }

      case ALLOW_SPLITTING_UNSCORED_TABLET: {
        const drug = draft.prescribedDrugs!.find((d) => d.id === action.data.id)!;
        drug.allowSplittingUnscoredTablet = action.data.allow;
        draft.isSaved = false;
        break;
      }

      case INTERVAL_START_DATE_CHANGE: {
        const drug = draft.prescribedDrugs!.find((d) => d.id === action.data.id)!;
        drug.intervalStartDate = new Date(action.data.date.valueOf() + action.data.date.getTimezoneOffset() * 60 * 1000);

        if (drug.intervalEndDate) {
          drug.intervalUnit = 'Days';
          drug.intervalCount = action.data.intervalDurationDays;
          drug.intervalDurationDays = action.data.intervalDurationDays;
        }
        draft.isInputComplete = validateCompleteInputs(draft.prescribedDrugs);
        draft.isSaved = false;
        break;
      }

      case INTERVAL_END_DATE_CHANGE: {
        const drug = draft.prescribedDrugs!.find((d) => d.id === action.data.id)!;
        drug.intervalEndDate = action.data.date;
        drug.intervalUnit = 'Days';
        drug.intervalCount = action.data.intervalDurationDays;
        drug.intervalDurationDays = action.data.intervalDurationDays;
        draft.isInputComplete = validateCompleteInputs(draft.prescribedDrugs);
        draft.isSaved = false;
        break;
      }

      case INTERVAL_UNIT_CHANGE: {
        const drug = draft.prescribedDrugs!.find((d) => d.id === action.data.id)!;
        drug.intervalUnit = action.data.unit;
        drug.intervalEndDate = action.data.intervalEndDate;
        drug.intervalDurationDays = action.data.intervalDurationDays;
        draft.isInputComplete = validateCompleteInputs(draft.prescribedDrugs);
        draft.isSaved = false;
        break;
      }

      case INTERVAL_COUNT_CHANGE: {
        const drug = draft.prescribedDrugs!.find((d) => d.id === action.data.id)!;
        drug.intervalCount = action.data.count;
        drug.intervalEndDate = action.data.intervalEndDate;
        drug.intervalDurationDays = action.data.intervalDurationDays;
        draft.isInputComplete = validateCompleteInputs(draft.prescribedDrugs);
        draft.isSaved = false;
        break;
      }

      case TABLE_DOSAGE_EDITED: {
        if (action.data.rowIndex !== null) {
          const editedRow = draft.projectedSchedule.data[action.data.rowIndex];
          const dosage = parseFloat(action.data.newValue);
          const unitDosages = calcMinimumQuantityForDosage(editedRow.availableDosageOptions!, dosage, editedRow.regularDosageOptions);

          draft.projectedSchedule.data[action.data.rowIndex] = {
            ...editedRow,
            dosage,
            unitDosages,
            prescription: prescription({ ...editedRow }, unitDosages),
          };
          draft.finalPrescription = calcFinalPrescription(draft.projectedSchedule.data, draft.tableSelectedRows);
        }

        break;
      }

      case TABLE_START_DATE_EDITED:
        if (action.data.rowIndex !== null) {
          const editedRow = draft.projectedSchedule.data[action.data.rowIndex];
          editedRow.startDate = action.data.newValue;
          editedRow.intervalUnit = 'Days';
          editedRow.intervalDurationDays = differenceInCalendarDays(editedRow.endDate!, editedRow.startDate!) + 1;
          editedRow.intervalCount = editedRow.intervalDurationDays;
          editedRow.prescription = prescription({ ...editedRow }, editedRow.unitDosages!);
          draft.finalPrescription = calcFinalPrescription(draft.projectedSchedule.data, draft.tableSelectedRows);
        }
        break;

      case TABLE_END_DATE_EDITED:
        if (action.data.rowIndex !== null) {
          const editedRow = draft.projectedSchedule.data[action.data.rowIndex];
          editedRow.endDate = action.data.newValue;
          editedRow.intervalUnit = 'Days';
          editedRow.intervalDurationDays = differenceInCalendarDays(editedRow.endDate!, editedRow.startDate!) + 1;
          editedRow.intervalCount = editedRow.intervalDurationDays;
          editedRow.prescription = prescription({ ...editedRow }, editedRow.unitDosages!);
          draft.finalPrescription = calcFinalPrescription(draft.projectedSchedule.data, draft.tableSelectedRows);
        }
        break;

      case SET_IS_INPUT_COMPLETE:
        draft.isInputComplete = action.data.isComplete;
        break;

      case VALIDATE_INPUT_COMPLETION:
        draft.isInputComplete = validateCompleteInputs(draft.prescribedDrugs);
        break;

      case EDIT_PROJECTED_SCHEDULE_FROM_MODAL: {
        /**
         * 1. Change draft.prescribedDrugs ..?
         * - change previous prescribedDrug - modify the target dosage to the previous row of double clicked one
         * -> call generate_schedule event/function
         * - update all the rows at once
         * 2. Directly change draft.projectedSchedule..?
         * - still need to change draft.prescribedDrugs
         */
        // const prevRow = draft.modal_prevRow!;
        // const doubleClickedRow = draft.modal_doubleClickedRow;

        // const prevDrug = draft.prescribedDrugs!.find((drug) => drug.id === draft.modal_prevRow!.prescribedDrugId)!;
        // prevDrug.targetDosage = prevRow.dosage;
        // draft.prescribedDrugs![draft.prescribedDrugs!.length - 1].applyInSchedule = true;
        // prevDrug.intervalStartDate = prevRow.startDate!;
        // prevDrug.intervalEndDate = prevRow.endDate!;
        // prevDrug.intervalCount = prevRow.intervalCount;
        // prevDrug.intervalUnit = prevRow.intervalUnit!;

        //
        // const [prevRow, doubleClickedRow] = action.data.doubleClickedRowAndBefore;
        // const prevDrug = draft.prescribedDrugs!.find((drug) => drug.id === action.data.doubleClickedRowAndBefore[0].prescribedDrugId)!;
        // prevDrug.targetDosage = prevRow.dosage;
        // // TODO: need to handle different cases of start/end dates..
        // prevDrug.intervalEndDate = prevRow.endDate;
        // prevDrug.intervalCount = differenceInCalendarDays(prevRow.endDate!, prevRow.startDate!);
        // prevDrug.intervalUnit = 'Days';
        //
        // // TODO: change draft.prescriptionFormIds, draft.lastPrescriptionFormId,..
        // if (isBefore(prevDrug.intervalEndDate!, prevDrug.intervalStartDate)) {
        //   // TODO: handle this case
        // }
        //
        // // add new prescribed drug here
        // draft.prescribedDrugs!.push(action.data.prescribedDrugGeneratedFromRow);
        //
        // /*
        // draft.projectedSchedule.data.forEach((row, i) => {
        //   if (row.prescribedDrugId === action.data.doubleClickedRowAndBefore.prescribedDrugId
        //   && row.rowIndexInPrescribedDrug >= action.data.doubleClickedRowAndBefore.rowIndexInPrescribedDrug) {
        //     draft.projectedSchedule.data.splice(i);
        //     // draft.projectedSchedule.data.
        //   }
        // });
        //  */

        break;
      }

      default:
        return state;
    }
  });
};
export default taperConfigReducer;
