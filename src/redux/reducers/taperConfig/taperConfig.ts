import produce from 'immer';
import differenceInCalendarDays from 'date-fns/esm/differenceInCalendarDays';
import isBefore from 'date-fns/isBefore';
import {
  Drug, PrescribedDrug, Prescription, TableRowData, TaperingConfiguration,
} from '../../../types';
import {
  ADD_NEW_DRUG_FORM,
  ADD_OR_UPDATE_TAPER_CONFIG_FAILURE,
  ADD_OR_UPDATE_TAPER_CONFIG_REQUEST,
  ADD_OR_UPDATE_TAPER_CONFIG_SUCCESS,
  AddNewDrugFormAction,
  AddOrUpdateTaperConfigAyncActions,
  CHANGE_MESSAGE_FOR_PATIENT,
  CHANGE_NOTE_AND_INSTRUCTIONS,
  ChangeMessageForPatient,
  ChangeNoteAndInstructions,
  CLEAR_SCHEDULE,
  ClearScheduleAction,
  EDIT_PROJECTED_SCHEDULE_FROM_MODAL,
  EditProjectedScheduleFromModal,
  EMPTY_PRESCRIBED_DRUGS,
  EMPTY_TAPER_CONFIG_PAGE,
  EmptyPrescribedDrugs,
  EmptyTaperConfigPage,
  FETCH_PRESCRIBED_DRUGS_FAILURE,
  FETCH_PRESCRIBED_DRUGS_REQUEST,
  FETCH_PRESCRIBED_DRUGS_SUCCESS,
  FETCH_TAPER_CONFIG_FAILURE,
  FETCH_TAPER_CONFIG_REQUEST,
  FETCH_TAPER_CONFIG_SUCCESS,
  FetchPrescribedDrugAsyncActions,
  FetchTaperConfigAsyncActions,
  FINAL_PRESCRIPTION_QUANTITY_CHANGE,
  FinalPrescriptionQuantityChange,
  GENERATE_SCHEDULE,
  GenerateScheduleAction,
  INIT_NEW_TAPER_CONFIG,
  InitTaperConfigAction, OPEN_MODAL, OpenModalAction,
  REMOVE_DRUG_FORM,
  RemoveDrugFormAction,
  SCHEDULE_ROW_SELECTED,
  ScheduleRowSelectedAction,
  SET_IS_INPUT_COMPLETE,
  SetIsInputComplete,
  SHARE_WITH_PATIENT_APP_FAILURE,
  SHARE_WITH_PATIENT_APP_REQUEST,
  SHARE_WITH_PATIENT_APP_SUCCESS,
  SHARE_WITH_PATIENT_EMAIL_FAILURE,
  SHARE_WITH_PATIENT_EMAIL_REQUEST,
  SHARE_WITH_PATIENT_EMAIL_SUCCESS,
  ShareWithPatientAppAsyncActions,
  ShareWithPatientEmailAsyncActions,
  TABLE_DOSAGE_EDITED,
  TABLE_END_DATE_EDITED,
  TABLE_START_DATE_EDITED,
  TableEditingAction,
  TOGGLE_SHARE_PROJECTED_SCHEDULE_WITH_PATIENT,
  ToggleShareProjectedScheduleWithPatient,
  UPDATE_CHART,
  UpdateChartAction,
  VALIDATE_INPUT_COMPLETION,
  ValidateInputCompletionAction,
} from '../../actions/taperConfig';
import drugs from '../drugs';

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
import { Schedule } from '../../../components/Schedule/ProjectedSchedule';
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

      case ADD_OR_UPDATE_TAPER_CONFIG_REQUEST:
        draft.addingTaperConfig = true;
        draft.addedTaperConfig = false;
        draft.addingTaperConfigError = null;
        break;

      case ADD_OR_UPDATE_TAPER_CONFIG_SUCCESS: {
        draft.addingTaperConfig = false;
        draft.addedTaperConfig = true;
        draft.taperConfigId = action.data.id;
        draft.taperConfigCreatedAt = action.data.createdAt;
        draft.prescribedDrugs!.forEach((drug) => {
          drug.prescribedAt = action.data.createdAt;
        });
        draft.isInputComplete = validateCompleteInputs(draft.prescribedDrugs);
        draft.isSaved = true;
        break;
      }

      case ADD_OR_UPDATE_TAPER_CONFIG_FAILURE:
        draft.addingTaperConfig = false;
        draft.addedTaperConfig = false;
        draft.addingTaperConfigError = action.error;
        draft.isInputComplete = validateCompleteInputs(draft.prescribedDrugs);
        break;

      case FETCH_TAPER_CONFIG_REQUEST:
        draft.fetchingTaperConfig = true;
        draft.fetchedTaperConfig = false;
        draft.fetchingTaperConfigError = null;
        break;

      case FETCH_TAPER_CONFIG_SUCCESS:
        draft.fetchingTaperConfig = false;
        draft.fetchedTaperConfig = true;
        draft.clinicianId = action.data.clinicianId;
        draft.patientId = action.data.patientId;
        draft.prescribedDrugs = action.data.prescribedDrugs;
        draft.lastPrescriptionFormId = Math.max(...action.data.prescribedDrugs.map((drug) => drug.id));
        draft.isInputComplete = validateCompleteInputs(draft.prescribedDrugs);
        draft.isSaved = false;
        break;

      case FETCH_TAPER_CONFIG_FAILURE:
        draft.fetchingTaperConfig = false;
        draft.fetchingTaperConfigError = action.error;
        break;

      case FETCH_PRESCRIBED_DRUGS_REQUEST:
        draft.fetchingPrescribedDrugs = true;
        draft.fetchedPrescribedDrugs = false;
        draft.fetchingPrescribedDrugsError = false;
        break;

      case FETCH_PRESCRIBED_DRUGS_SUCCESS:
        draft.fetchingPrescribedDrugs = false;
        draft.fetchedPrescribedDrugs = true;
        draft.prescribedDrugs = action.data;
        draft.isInputComplete = validateCompleteInputs(draft.prescribedDrugs);
        break;

      case FETCH_PRESCRIBED_DRUGS_FAILURE:
        draft.fetchingPrescribedDrugs = false;
        draft.fetchingPrescribedDrugsError = action.error;
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

      case SHARE_WITH_PATIENT_APP_REQUEST:
        draft.sharingWithPatientApp = true;
        draft.sharedWithPatientApp = false;
        draft.sharingWithPatientAppError = null;
        break;

      case SHARE_WITH_PATIENT_APP_SUCCESS:
        draft.sharingWithPatientApp = false;
        draft.sharedWithPatientApp = true;
        break;

      case SHARE_WITH_PATIENT_APP_FAILURE:
        draft.sharingWithPatientApp = false;
        draft.sharingWithPatientAppError = action.error;
        break;

      case SHARE_WITH_PATIENT_EMAIL_REQUEST:
        draft.sharingWithPatientEmail = true;
        draft.sharedWithPatientEmail = false;
        draft.sharingWithPatientEmailError = null;
        break;

      case SHARE_WITH_PATIENT_EMAIL_SUCCESS:
        draft.sharingWithPatientEmail = false;
        draft.sharedWithPatientEmail = true;
        break;

      case SHARE_WITH_PATIENT_EMAIL_FAILURE:
        draft.sharingWithPatientEmail = false;
        draft.sharingWithPatientEmailError = action.error;
        break;

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

        // case OPEN_MODAL:
        //   draft.prescribedDrugs!.push(action.data.drugFromRows);
        //   draft.modal_prevRow = action.data.prevRow;
        //   draft.modal_doubleClickedRow = action.data.doubleClickedRow;
        //   break;

      case EDIT_PROJECTED_SCHEDULE_FROM_MODAL: {
        /**
         * 1. Change draft.prescribedDrugs ..?
         * - change previous prescribedDrug - modify the target dosage to the previous row of double clicked one
         * -> call generate_schedule event/function
         * - update all the rows at once
         * 2. Directly change draft.projectedSchedule..?
         * - still need to change draft.prescribedDrugs
         */
        const prevRow = draft.modal_prevRow!;
        const doubleClickedRow = draft.modal_doubleClickedRow;

        const prevDrug = draft.prescribedDrugs!.find((drug) => drug.id === draft.modal_prevRow!.prescribedDrugId)!;
        prevDrug.targetDosage = prevRow.dosage;
        draft.prescribedDrugs![draft.prescribedDrugs!.length - 1].applyInSchedule = true;
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
