import produce from 'immer';
import {
  ADD_NEW_PATIENT_FAILURE,
  ADD_NEW_PATIENT_REQUEST,
  ADD_NEW_PATIENT_SUCCESS,
  AddNewPatientActions,
  CHANGE_PATIENT_NOTES,
  ChangePatientNotes,
  LOAD_PATIENTS_FAILURE,
  LOAD_PATIENTS_REQUEST,
  LOAD_PATIENTS_SUCCESS,
  LoadPatientsActions,
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LoginActions,
  SAVE_PATIENT_NOTES_FAILURE,
  SAVE_PATIENT_NOTES_REQUEST,
  SAVE_PATIENT_NOTES_SUCCESS,
  SavePatientNotesActions,
  SET_CURRENT_PATIENT,
  SetCurrentPatientAction,
} from '../actions/user';
import { Clinician, Patient } from '../../types';
import { ADD_OR_UPDATE_TAPER_CONFIG_SUCCESS, AddOrUpdateTaperConfigSuccessAction } from '../actions/taperConfig';

export interface UserState {
  loggingIn: boolean;
  loggedIn: boolean;
  logInError: any;

  addingPatient: boolean;
  addedPatient: boolean;
  addPatientError: any;

  loadingPatients: boolean;
  loadedPatients: boolean;
  loadPatientsError: any;

  savingPatientNotes: boolean;
  savedPatientNotes: boolean;
  savingPatientNotesError: any;

  // patients: Omit<Patient, 'password'|'taperingConfigurations'>[];
  patients: Omit<Patient, 'password'>[];
  currentPatient: Omit<Patient, 'password'>|null;
  me: Omit<Clinician, 'password'>|null;
}

export const initialState: UserState = {
  loggingIn: false,
  loggedIn: false,
  logInError: null,

  addingPatient: false,
  addedPatient: false,
  addPatientError: null,

  loadingPatients: false,
  loadedPatients: false,
  loadPatientsError: null,

  savingPatientNotes: false,
  savedPatientNotes: false,
  savingPatientNotesError: null,

  patients: [],
  currentPatient: null,
  me: null,
};

type UserReducerAction =
  | LoginActions
  | AddNewPatientActions
  | AddOrUpdateTaperConfigSuccessAction
  | LoadPatientsActions
  | ChangePatientNotes
  | SetCurrentPatientAction
  | SavePatientNotesActions;

const userReducer = (state: UserState = initialState, action: UserReducerAction): UserState => produce(state, (draft) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      draft.loggingIn = true;
      draft.loggedIn = false;
      draft.logInError = null;
      break;

    case LOGIN_SUCCESS:
      draft.loggingIn = false;
      draft.loggedIn = true;
      draft.me = action.data;
      break;

    case LOGIN_FAILURE:
      draft.loggingIn = false;
      draft.loggedIn = false;
      draft.logInError = action.error;
      break;

    case ADD_NEW_PATIENT_REQUEST:
      draft.addingPatient = true;
      draft.addedPatient = false;
      draft.addPatientError = null;
      break;

    case ADD_NEW_PATIENT_SUCCESS:
      draft.addingPatient = false;
      draft.addedPatient = true;
      break;

    case ADD_NEW_PATIENT_FAILURE:
      draft.addingPatient = false;
      draft.addPatientError = action.error;
      break;

    case LOAD_PATIENTS_REQUEST:
      draft.loadingPatients = true;
      draft.loadedPatients = false;
      draft.loadPatientsError = null;
      break;

    case LOAD_PATIENTS_SUCCESS:
      draft.loadingPatients = false;
      draft.loadedPatients = true;
      draft.patients = action.data;
      break;

    case LOAD_PATIENTS_FAILURE:
      draft.loadingPatients = false;
      draft.loadPatientsError = action.error;
      break;

    case SAVE_PATIENT_NOTES_REQUEST:
      draft.savingPatientNotes = true;
      draft.savedPatientNotes = false;
      draft.savingPatientNotesError = null;
      break;

    case SAVE_PATIENT_NOTES_SUCCESS:
      draft.savingPatientNotes = false;
      draft.savedPatientNotes = true;
      draft.currentPatient!.notes = action.data.notes;
      break;

    case SAVE_PATIENT_NOTES_FAILURE:
      draft.savingPatientNotes = false;
      draft.savingPatientNotesError = action.error;
      break;

    case SET_CURRENT_PATIENT:
      if (action.data === -1) {
        draft.currentPatient = null;
      }
      draft.currentPatient = draft.patients.find((patient) => patient.id === action.data)!;
      break;

    case ADD_OR_UPDATE_TAPER_CONFIG_SUCCESS:
      draft.currentPatient!.taperingConfiguration = action.data;
      break;

    case CHANGE_PATIENT_NOTES:
      draft.currentPatient!.notes = action.data;
      break;

    default:
      return state;
  }
});

export default userReducer;
