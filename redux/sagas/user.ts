import {all, delay, fork, put, takeLatest} from 'redux-saga/effects';
import {
  ADD_NEW_PATIENT_FAILURE, ADD_NEW_PATIENT_REQUEST,
  ADD_NEW_PATIENT_SUCCESS, AddNewPatientFailure,
  AddNewPatientRequest,
  AddNewPatientSuccess,
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LoginFailureAction,
  LoginRequestAction,
  LoginSuccessAction
} from "../actions/user";
import {Clinician, Patient} from "../../types";
import {stephen, xiao} from "./dummies";


function loginAPI(): { data: Omit<Clinician, 'password'> } {

  return {data: stephen};
}

function* logIn(action: LoginRequestAction) {
  try {
    yield delay(1000);
    const result = loginAPI();

    yield put<LoginSuccessAction>({
      type: LOGIN_SUCCESS,
      data: result.data,
    })
  } catch (err) {
    console.error(err);
    yield put<LoginFailureAction>({
      type: LOGIN_FAILURE,
      error: err.response.data,
    });
  }
}

function addPatientAPI(): { data: Omit<Patient, "password"> } {
  return {data: xiao}
}

function* addPatient(action: AddNewPatientRequest) {
  try {
    yield delay(1000);
    const result = addPatientAPI();

    yield put<AddNewPatientSuccess>({
      type: ADD_NEW_PATIENT_SUCCESS,
      data: result.data
    });
  } catch (err) {
    console.error(err);
    yield put<AddNewPatientFailure>({
      type: ADD_NEW_PATIENT_FAILURE,
      error: err.response.data,
    });
  }
}


function* watchLogIn() {
  yield takeLatest(LOGIN_REQUEST, logIn);
}

function* watchAddPatient() {
  yield takeLatest(ADD_NEW_PATIENT_REQUEST, addPatient);
}

export default function* userSaga() {
  yield all([fork(watchLogIn), fork(watchAddPatient)])
};
