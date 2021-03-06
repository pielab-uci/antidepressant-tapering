import produce from 'immer';
import differenceInCalendarDays from 'date-fns/esm/differenceInCalendarDays';
import {
  ADD_NEW_DRUG_FORM,
  ADD_OR_UPDATE_TAPER_CONFIG_FAILURE,
  ADD_OR_UPDATE_TAPER_CONFIG_REQUEST,
  ADD_OR_UPDATE_TAPER_CONFIG_SUCCESS,
  CHANGE_MESSAGE_FOR_PATIENT,
  CHANGE_NOTE_AND_INSTRUCTIONS,
  CLEAR_SCHEDULE,
  EDIT_PROJECTED_SCHEDULE_FROM_MODAL,
  EMPTY_PRESCRIBED_DRUGS,
  EMPTY_TAPER_CONFIG_PAGE,
  FETCH_PRESCRIBED_DRUGS_FAILURE,
  FETCH_PRESCRIBED_DRUGS_REQUEST,
  FETCH_PRESCRIBED_DRUGS_SUCCESS,
  FETCH_TAPER_CONFIG_FAILURE,
  FETCH_TAPER_CONFIG_REQUEST,
  FETCH_TAPER_CONFIG_SUCCESS,
  FINAL_PRESCRIPTION_QUANTITY_CHANGE,
  GENERATE_SCHEDULE,
  INIT_NEW_TAPER_CONFIG,
  REMOVE_DRUG_FORM,
  SCHEDULE_ROW_SELECTED,
  SET_IS_INPUT_COMPLETE,
  SHARE_WITH_PATIENT_APP_FAILURE,
  SHARE_WITH_PATIENT_APP_REQUEST,
  SHARE_WITH_PATIENT_APP_SUCCESS, SHARE_WITH_PATIENT_EMAIL_FAILURE,
  SHARE_WITH_PATIENT_EMAIL_REQUEST, SHARE_WITH_PATIENT_EMAIL_SUCCESS,
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
  CURRENT_DOSAGE_CHANGE,
  SET_GOAL_DOSAGE, SET_GROWTH,
  NEXT_DOSAGE_CHANGE,
} from '../../../components/PrescriptionForm/actions';
import {
  alignEndDates,
  calcFinalPrescription,
  calcMinimumQuantityForDosage,
  chartDataConverter, checkIntervalOverlappingRows, convert,
  generateInstructionsFromSchedule,
  generateTableRows, handleIntervalOverlap,
  isCompleteDrugInput,
  prescription,
  ScheduleChartData,
  scheduleGenerator, sort, TableRowsByDrug,
  validateCompleteInputs,
} from '../../../utils/taperConfig';
import {
  TaperConfigState, TaperConfigActions, emptyPrescribedDrug, initialState,
} from './index';
import { Converted, TableRowData } from '../../../types';
import { SET_CURRENT_PATIENT } from '../../actions/user';

const taperConfigReducer = (state: TaperConfigState = initialState, action: TaperConfigActions) => {
  console.log('taperConfigAction: ', action);
  return produce(state, (draft) => {
    switch (action.type) {
      case INIT_NEW_TAPER_CONFIG:
        draft.clinicianId = action.data.clinicianId;
        draft.patientId = action.data.patientId;
        draft.chosenDrugs = [];
        draft.taperConfigCreatedAt = null;
        draft.lastPrescriptionFormId += 1;
        draft.prescribedDrugs = [emptyPrescribedDrug(draft.lastPrescriptionFormId)];
        draft.isSaved = false;
        draft.isInputComplete = false;
        break;

      case EMPTY_TAPER_CONFIG_PAGE:
        draft.currentTaperConfigId = null;
        draft.taperConfigCreatedAt = null;
        draft.scheduleChartData = [];
        draft.chosenDrugs = [];
        draft.isInputComplete = false;
        // draft.prescribedDrugs = draft.prescribedDrugs!.filter((drug) => isCompleteDrugInput(drug));
        draft.prescribedDrugs = [];
        draft.tableSelectedRows = [];
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
        if (action.data) {
          draft.prescriptionFormIds = draft.prescriptionFormIds.filter((id) => id !== action.data);
          draft.prescribedDrugs = draft.prescribedDrugs!.filter((drug) => drug.id !== action.data);
          delete draft.chosenDrugs[action.data];
        } else {
          draft.prescriptionFormIds.pop();
          draft.prescribedDrugs!.pop();
          // draft.chosenDrugs = draft.prescribedDrugs!.map((drug) => drug.name);
        }
        draft.isSaved = false;
        draft.isInputComplete = validateCompleteInputs(draft.prescribedDrugs, isCompleteDrugInput);
        break;

      case GENERATE_SCHEDULE: {
        draft.projectedSchedule = scheduleGenerator(action.data);
        draft.scheduleChartData = chartDataConverter(draft.projectedSchedule);
        draft.tableSelectedRows = draft.projectedSchedule.data.map((row, i) => (row.selected ? i : -1)).filter((idx) => idx !== -1);
        draft.finalPrescription = calcFinalPrescription(draft.projectedSchedule.data, draft.tableSelectedRows);
        const notes = generateInstructionsFromSchedule(draft.projectedSchedule, 'both', draft.finalPrescription);
        [draft.instructionsForPatient, draft.instructionsForPharmacy] = [notes.patient!, notes.pharmacy!];
        draft.showInstructionsForPatient = true;
        draft.isSaved = false;
        break;
      }

      case CLEAR_SCHEDULE:
        draft.projectedSchedule = { data: [], drugs: [] };
        draft.scheduleChartData = [];
        draft.tableSelectedRows = [];
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

        /*
        // const maxIdx = action.data.selected ? action.data.rowIdx : action.data.rowIdx - 1;
        // draft.tableSelectedRows = [];
        // draft.projectedSchedule.data.forEach((row) => {
        //   row.selected = false;
        // });
        // draft.projectedSchedule.data.forEach((row, i) => {
        //   if (i <= maxIdx && !row.isPriorDosage) {
        //     row.selected = true;
        //     draft.tableSelectedRows.push(i);
        //   }
        // });

        draft.tableSelectedRows = [];
        draft.projectedSchedule.data.forEach((row, i) => {
          if (i <= action.data && !row.isPriorDosage) {
            row.selected = true;
            draft.tableSelectedRows.push(i);
          } else {
            row.selected = false;
          }
        });
         */
        draft.finalPrescription = calcFinalPrescription(draft.projectedSchedule.data, draft.tableSelectedRows);
        if (draft.finalPrescription && Object.keys(draft.finalPrescription).length === 0) {
          draft.instructionsForPatient = '';
          draft.instructionsForPharmacy = '';
        } else {
          const notes = generateInstructionsFromSchedule(draft.projectedSchedule, 'both', draft.finalPrescription);
          [draft.instructionsForPatient, draft.instructionsForPharmacy] = [notes.patient!, notes.pharmacy!];
        }
        break;
      }

      // directly edit notes for patient or pharmacy
      // case FINAL_PRESCRIPTION_QUANTITY_CHANGE:
      //   // draft.finalPrescription[action.data.id].dosageQty[action.data.dosage] = action.data.quantity;
      //   // draft.finalPrescription[action.data.id].find(prescription => prescrioption.form === action.data.)
      //   draft.instructionsForPharmacy = generateInstructionsFromSchedule(draft.projectedSchedule, 'pharmacyOnly', draft.finalPrescription).pharmacy!;
      //   draft.isSaved = false;
      //   break;

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
        draft.chosenDrugs[action.data.id] = {
          drug: correspondingDrugData.name,
          brand: action.data.brand,
        };

        drug.name = correspondingDrugData.name;
        drug.halfLife = correspondingDrugData.halfLife;
        drug.brand = action.data.brand;
        drug.form = null;
        drug.nextDosageForm = null;
        drug.nextOralDosageInfo = null;
        if (!drug.isModal) {
          drug.currentDosageForm = null;
          drug.currentOralDosageInfo = null;
        }
        drug.allowChangePriorDosage = true;
        drug.oralDosageInfo = null;
        drug.currentDosages = [];
        drug.nextDosages = [];
        drug.targetDosage = 0;
        draft.isInputComplete = false;
        draft.isSaved = false;
        draft.instructionsForPatient = '';
        draft.instructionsForPharmacy = '';
        draft.showInstructionsForPatient = false;
        break;
      }

      case CHOOSE_FORM: {
        const drug = draft.prescribedDrugs!.find((d) => d.id === action.data.id)!;
        // TODO: remove drug.form?
        drug.form = action.data.form;
        drug.nextDosageForm = action.data.form;
        drug.minDosageUnit = action.data.minDosageUnit;
        drug.nextDosages = [];
        drug.nextOralDosageInfo = action.data.oralDosageInfo;
        drug.oralDosageInfo = action.data.oralDosageInfo;

        if (!drug.isModal) {
          drug.currentDosages = [];
          drug.currentDosageForm = action.data.form;
          drug.currentOralDosageInfo = action.data.oralDosageInfo;
        }

        drug.availableDosageOptions = action.data.availableDosageOptions;
        drug.regularDosageOptions = action.data.regularDosageOptions;
        draft.isInputComplete = false;
        draft.isSaved = false;
        draft.instructionsForPatient = '';
        draft.instructionsForPharmacy = '';
        break;
      }

      case CURRENT_DOSAGE_CHANGE: {
        const drug = draft.prescribedDrugs!.find((d) => d.id === action.data.id)!;
        const idx = drug.currentDosages.findIndex(
          (curDosage) => curDosage.dosage === action.data.dosage.dosage,
        );

        if (idx === -1) {
          drug.currentDosages.push(action.data.dosage);
        } else {
          drug.currentDosages[idx] = action.data.dosage;
        }

        drug.currentDosageSum = drug.currentDosages.reduce((prev, { dosage, quantity }) => {
          return prev + parseFloat(dosage) * quantity;
        }, 0);

        if (drug.currentDosageSum > drug.nextDosageSum) {
          drug.targetDosage = 0;
        } else if (drug.currentDosageSum < drug.nextDosageSum) {
          drug.targetDosage = drug.nextDosageSum;
        } else {
          drug.targetDosage = drug.currentDosageSum;
        }

        draft.isSaved = false;
        draft.isInputComplete = validateCompleteInputs(draft.prescribedDrugs, isCompleteDrugInput);
        break;
      }

      case NEXT_DOSAGE_CHANGE: {
        const drug = draft.prescribedDrugs!.find((d) => d.id === action.data.id)!;
        const idx = drug.nextDosages.findIndex(
          (nextDosage) => nextDosage.dosage === action.data.dosage.dosage,
        );

        if (idx === -1) {
          drug.nextDosages.push(action.data.dosage);
        } else {
          drug.nextDosages[idx] = action.data.dosage;
        }

        drug.nextDosageSum = drug.nextDosages.reduce((prev, { dosage, quantity }) => {
          return prev + parseFloat(dosage) * quantity;
        }, 0);

        if (drug.currentDosageSum < drug.nextDosageSum) {
          drug.targetDosage = drug.nextDosageSum;
        } else if (drug.currentDosageSum > drug.nextDosageSum) {
          if (!drug.isModal) {
            drug.targetDosage = 0;
          }
        } else {
          drug.targetDosage = drug.nextDosageSum;
        }

        draft.isInputComplete = validateCompleteInputs(draft.prescribedDrugs, isCompleteDrugInput);
        draft.isSaved = false;
        break;
      }

      case SET_GOAL_DOSAGE: {
        const drug = draft.prescribedDrugs!.find((d) => d.id === action.data.id)!;
        drug.targetDosage = action.data.dosage;
        break;
      }

      case ALLOW_SPLITTING_UNSCORED_TABLET: {
        const drug = draft.prescribedDrugs!.find((d) => d.id === action.data.id)!;
        drug.allowSplittingUnscoredTablet = action.data.allow;
        // TODO: continue from here..
        if (action.data.allow) {
          drug.availableDosageOptions = [...new Set(action.data.dosageOptions.map((option) => {
            if (option.isScored) {
              return option.dosage;
            }
            return [`${parseFloat(option.dosage) / 2}mg`, option.dosage];
          }).flat())];
        } else {
          drug.availableDosageOptions = drug.regularDosageOptions!;
        }
        draft.isSaved = false;
        break;
      }

      case INTERVAL_START_DATE_CHANGE: {
        const drug = draft.prescribedDrugs!.find((d) => d.id === action.data.id)!;
        drug.intervalStartDate = action.data.intervalStartDate;
        drug.intervalEndDate = action.data.intervalEndDate || drug.intervalEndDate;
        drug.intervalUnit = action.data.intervalUnit || drug.intervalUnit;
        drug.intervalDurationDays = action.data.intervalDurationDays || drug.intervalDurationDays;
        drug.intervalCount = action.data.intervalCount || drug.intervalCount;
        break;
      }

      case INTERVAL_END_DATE_CHANGE: {
        const drug = draft.prescribedDrugs!.find((d) => d.id === action.data.id)!;
        drug.intervalEndDate = action.data.intervalEndDate;
        drug.intervalStartDate = action.data.intervalStartDate || drug.intervalStartDate;
        drug.intervalDurationDays = action.data.intervalDurationDays || drug.intervalDurationDays;
        drug.intervalCount = action.data.intervalCount || drug.intervalCount;
        drug.intervalUnit = action.data.intervalUnit || drug.intervalUnit;
        break;
      }

      case INTERVAL_UNIT_CHANGE: {
        const drug = draft.prescribedDrugs!.find((d) => d.id === action.data.id)!;
        drug.intervalUnit = action.data.unit;
        drug.intervalEndDate = action.data.intervalEndDate;
        drug.intervalCount = action.data.intervalCount;
        drug.intervalDurationDays = action.data.intervalDurationDays;
        draft.isInputComplete = validateCompleteInputs(draft.prescribedDrugs, isCompleteDrugInput);
        draft.isSaved = false;
        break;
      }

      case INTERVAL_COUNT_CHANGE: {
        const drug = draft.prescribedDrugs!.find((d) => d.id === action.data.id)!;
        drug.intervalCount = action.data.count;
        drug.intervalEndDate = action.data.count !== null ? action.data.intervalEndDate : null;
        drug.intervalDurationDays = action.data.intervalDurationDays;
        draft.isInputComplete = validateCompleteInputs(draft.prescribedDrugs, isCompleteDrugInput);
        draft.isSaved = false;
        break;
      }

      case SET_GROWTH: {
        const drug = draft.prescribedDrugs!.find((d) => d.id === action.data.id)!;
        drug.growth = action.data.growth;
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
        if (!action.data) {
          draft.isInputComplete = validateCompleteInputs(draft.prescribedDrugs, isCompleteDrugInput);
        } else {
          draft.isInputComplete = validateCompleteInputs(draft.prescribedDrugs, isCompleteDrugInput) && action.data.isGoalDosageValid;
        }
        break;

      case EDIT_PROJECTED_SCHEDULE_FROM_MODAL: {
        /**
         * When medication is changed: add new medication with full new settings
         * When dosage is changed:
         *  - when dosage was increasing before -> increase the dosage of other table rows by the same amount
         *  - when dosage was decreasing before -> decrease the dosage of other table rows by new decreasing rate
         * When start/end date is changed:
         * - When start date is changed: only affect the double clicked row
         * - - When new start date is overlapped with previous rows with the same prescribed drug:
         * - When end date is changed: push the table rows with same prescribed drug back by the same interval unit count
         */

        /**
         * Check further: when modal tries to make invalid modification, including invalid start/end dates..
         */

        // Delete related rows
        draft.projectedSchedule.data = draft.projectedSchedule.data
          .filter((row) => (row.brand !== action.data.clickedRow.brand)
            || (row.brand === action.data.clickedRow.brand
            && row.rowIndexInPrescribedDrug < action.data.clickedRow.rowIndexInPrescribedDrug));

        // making new rows
        const converted: Converted[] = convert([action.data.prescribedDrug]);

        const generatedTableRows: TableRowData[] = generateTableRows(converted, action.data.clickedRow.rowIndexInPrescribedDrug);

        const intervalOverlapChecked: TableRowsByDrug = handleIntervalOverlap({
          originalRows: draft.projectedSchedule.data,
          newRows: generatedTableRows,
          prescribedDrugFromModal: action.data.prescribedDrug,
          clickedRowIndex: action.data.clickedRow.rowIndexInPrescribedDrug,
        });

        const tableRowsEndDatesAligned = alignEndDates(intervalOverlapChecked);
        const drugNames: string[] = [...new Set(draft.projectedSchedule.drugs.map((drug) => drug.name).concat([action.data.prescribedDrug.name]))];

        // const sorted: TableRowData[] = sort(drugNames, draft.projectedSchedule.data.concat(intervalOverlapChecked));
        // const sorted: TableRowData[] = sort(drugNames, intervalOverlapChecked);
        const sorted: TableRowData[] = sort(drugNames, tableRowsEndDatesAligned);

        draft.projectedSchedule.data = sorted;
        draft.projectedSchedule.drugs = draft.prescribedDrugs!.filter((drug) => drug.brand === action.data.prescribedDrug.brand).length !== 0
          ? draft.projectedSchedule.drugs
          : draft.projectedSchedule.drugs.concat(action.data.prescribedDrug);

        draft.scheduleChartData = chartDataConverter(draft.projectedSchedule);

        draft.tableSelectedRows = [];
        draft.finalPrescription = {};
        draft.instructionsForPatient = '';
        draft.instructionsForPharmacy = '';
        // const notes = generateInstructionsFromSchedule(draft.projectedSchedule, 'both', draft.finalPrescription);
        // [draft.instructionsForPatient, draft.instructionsForPharmacy] = [notes.patient!, notes.pharmacy!];
        break;
      }

      // case SET_CURRENT_PATIENT:
      //   draft.prescribedDrugs = [];
      //   draft.projectedSchedule = { drugs: [], data: [] };
      //   draft.scheduleChartData = [];

      case ADD_OR_UPDATE_TAPER_CONFIG_REQUEST:
        draft.addingTaperConfig = true;
        draft.addedTaperConfig = false;
        draft.addingTaperConfigError = null;
        break;

      case ADD_OR_UPDATE_TAPER_CONFIG_SUCCESS: {
        draft.addingTaperConfig = false;
        draft.addedTaperConfig = true;
        draft.currentTaperConfigId = action.data.id;

        // TODO: may not need taperConfigCreatedAt.
        // draft.taperConfigCreatedAt = action.data.createdAt;
        // draft.prescribedDrugs!.forEach((drug) => {
        //   drug.prescribedAt = action.data.createdAt;
        // });

        const taperConfigIdx = draft.taperConfigs
          .findIndex((config) => {
            return config.patientId === action.data.patientId
              && config.clinicianId === action.data.clinicianId;
          });

        if (taperConfigIdx !== -1) {
          draft.taperConfigs[taperConfigIdx] = action.data;
        } else {
          draft.taperConfigs.push(action.data);
        }

        // draft.isInputComplete = validateCompleteInputs(draft.prescribedDrugs);
        // draft.isSaved = true;
        break;
      }

      case ADD_OR_UPDATE_TAPER_CONFIG_FAILURE:
        draft.addingTaperConfig = false;
        draft.addedTaperConfig = false;
        draft.addingTaperConfigError = action.error;
        draft.isInputComplete = validateCompleteInputs(draft.prescribedDrugs, isCompleteDrugInput);
        break;

      case FETCH_TAPER_CONFIG_REQUEST:
        draft.fetchingTaperConfig = true;
        draft.fetchedTaperConfig = false;
        draft.fetchingTaperConfigError = null;
        draft.currentTaperConfigId = null;
        break;

      case FETCH_TAPER_CONFIG_SUCCESS:
        draft.fetchingTaperConfig = false;
        draft.fetchedTaperConfig = true;
        draft.clinicianId = action.data.clinicianId;
        draft.patientId = action.data.patientId;
        draft.currentTaperConfigId = action.data.id;
        draft.projectedSchedule = action.data.projectedSchedule;
        draft.instructionsForPatient = action.data.instructionsForPatient;
        draft.instructionsForPharmacy = action.data.instructionsForPharmacy;
        draft.finalPrescription = action.data.finalPrescription;
        draft.scheduleChartData = action.data.scheduleChartData;
        draft.tableSelectedRows = action.data.projectedSchedule.data.map((row, i) => {
          if (row.selected) {
            return i;
          }
          return -1;
        }).filter((idx) => idx !== -1);
        // draft.isInputComplete = validateCompleteInputs(draft.prescribedDrugs);
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
        draft.isInputComplete = validateCompleteInputs(draft.prescribedDrugs, isCompleteDrugInput);
        break;

      case FETCH_PRESCRIBED_DRUGS_FAILURE:
        draft.fetchingPrescribedDrugs = false;
        draft.fetchingPrescribedDrugsError = action.error;
        break;

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

      default:
        return state;
    }
  });
};
export default taperConfigReducer;
