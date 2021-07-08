import produce from 'immer';
import { initialState, TaperConfigState } from './index';
import {
  ADD_OR_UPDATE_TAPER_CONFIG_FAILURE,
  ADD_OR_UPDATE_TAPER_CONFIG_REQUEST,
  ADD_OR_UPDATE_TAPER_CONFIG_SUCCESS, AddOrUpdateTaperConfigAyncActions,
  FETCH_PRESCRIBED_DRUGS_FAILURE,
  FETCH_PRESCRIBED_DRUGS_REQUEST,
  FETCH_PRESCRIBED_DRUGS_SUCCESS,
  FETCH_TAPER_CONFIG_FAILURE,
  FETCH_TAPER_CONFIG_REQUEST,
  FETCH_TAPER_CONFIG_SUCCESS, FetchPrescribedDrugAsyncActions, FetchTaperConfigAsyncActions,
  SHARE_WITH_PATIENT_APP_FAILURE,
  SHARE_WITH_PATIENT_APP_REQUEST,
  SHARE_WITH_PATIENT_APP_SUCCESS,
  SHARE_WITH_PATIENT_EMAIL_FAILURE,
  SHARE_WITH_PATIENT_EMAIL_REQUEST,
  SHARE_WITH_PATIENT_EMAIL_SUCCESS, ShareWithPatientAppAsyncActions, ShareWithPatientEmailAsyncActions,
} from '../../actions/taperConfig';
import { validateCompleteInputs } from '../utils';

type TaperConfigAsyncActions =
  | FetchTaperConfigAsyncActions
  | FetchPrescribedDrugAsyncActions
  | AddOrUpdateTaperConfigAyncActions
  | ShareWithPatientAppAsyncActions
  | ShareWithPatientEmailAsyncActions;

const taperConfigAsyncReducer = (state: TaperConfigState = initialState, action: TaperConfigAsyncActions) => {
  console.log('taperConfigAsyncAction: ', action);
  return produce(state, (draft) => {
    switch (action.type) {
      case ADD_OR_UPDATE_TAPER_CONFIG_REQUEST:
        draft.addingTaperConfig = true;
        draft.addedTaperConfig = false;
        draft.addingTaperConfigError = null;
        break;

      case ADD_OR_UPDATE_TAPER_CONFIG_SUCCESS: {
        draft.addingTaperConfig = false;
        draft.addedTaperConfig = true;
        draft.taperConfigId = action.data.id;

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
        draft.projectedSchedule = action.data.projectedSchedule;
        draft.instructionsForPatient = action.data.instructionsForPatient;
        draft.instructionsForPharmacy = action.data.instructionsForPharmacy;
        draft.finalPrescription = action.data.finalPrescription;
        draft.scheduleChartData = action.data.scheduleChartData;
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
        draft.isInputComplete = validateCompleteInputs(draft.prescribedDrugs);
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
    }
  });
};

export default taperConfigAsyncReducer;
