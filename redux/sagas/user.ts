import {all, delay, fork, put, takeLatest} from 'redux-saga/effects';
import {
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LoginFailureAction,
  LoginRequestAction,
  LoginSuccessAction
} from "../actions/user";
import {Clinician, Patient, TaperingConfiguration} from "../../types";

function loginAPI(): {data: Omit<Clinician, 'password'>} {
  const dummyClinician: Omit<Clinician, 'password'> = {
    email: 'clinician@gmail.com',
    name: 'Stephen Few',
    id: 1,
    taperingConfigurations: [{
      clinicianId: 1,
      patient: { id:1, name: 'Sally Johnson', email: 'jonhnsons@uci.edu', taperingConfigurations: [] as TaperingConfiguration[],  },
    }, {
      clinicianId: 1,
      patient: { id:2, name: 'John Greenberg', email: 'greenbergj@uci.edu', taperingConfigurations: [] as TaperingConfiguration[] }
    }]
  }
  return{ data: dummyClinician };
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

function* watchLogIn() {
  yield takeLatest(LOGIN_REQUEST, logIn);
}


export default function* userSaga() {
  yield all([fork(watchLogIn)])
};
