import {
  all, put, fork, takeLatest, delay,
} from 'redux-saga/effects';
import {
  ADD_OR_UPDATE_TAPER_CONFIG_FAILURE,
  ADD_OR_UPDATE_TAPER_CONFIG_REQUEST,
  ADD_OR_UPDATE_TAPER_CONFIG_SUCCESS,
  AddOrUpdateTaperConfigFailureAction,
  AddOrUpdateTaperConfigRequestAction,
  AddOrUpdateTaperConfigSuccessAction,
  FETCH_PRESCRIBED_DRUGS_FAILURE, FETCH_PRESCRIBED_DRUGS_REQUEST,
  FETCH_PRESCRIBED_DRUGS_SUCCESS,
  FETCH_TAPER_CONFIG_FAILURE,
  FETCH_TAPER_CONFIG_REQUEST,
  FETCH_TAPER_CONFIG_SUCCESS,
  FetchPrescribedDrugsFailureAction,
  FetchPrescribedDrugsRequestAction,
  FetchPrescribedDrugsSuccessAction,
  FetchTaperConfigFailureAction,
  FetchTaperConfigRequestAction,
  FetchTaperConfigSuccessAction,
} from '../actions/taperConfig';
import { PrescribedDrug, TaperingConfiguration } from '../../types';

let taperConfigId = 100;

function addOrUpdateTaperConfigAPI(action: AddOrUpdateTaperConfigRequestAction): { data: TaperingConfiguration } {
  taperConfigId += 1;
  return {
    data: {
      ...action.data,
      id: taperConfigId,
      createdAt: new Date(),
    },
  };
}

function* addOrUpdateTaperConfig(action: AddOrUpdateTaperConfigRequestAction) {
  try {
    yield delay(1000);
    const result = addOrUpdateTaperConfigAPI(action);

    yield put<AddOrUpdateTaperConfigSuccessAction>({
      type: ADD_OR_UPDATE_TAPER_CONFIG_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put<AddOrUpdateTaperConfigFailureAction>({
      type: ADD_OR_UPDATE_TAPER_CONFIG_FAILURE,
      error: err.response.data,
    });
  }
}

function fetchTaperConfigAPI(action: FetchTaperConfigRequestAction): { data: TaperingConfiguration } {
  return {
    data: {
      id: action.data,
      clinicianId: 1,
      patientId: 1,
      createdAt: new Date('2021-05-14T21:00:06.387Z'),
      prescribedDrugs: [
        {
          id: 0,
          name: 'Fluoxetine',
          brand: 'Prozac',
          form: 'capsule',
          measureUnit: '',
          minDosageUnit: 5,
          availableDosageOptions: ['10mg', '20mg', '40mg'],
          allowSplittingUnscoredTablet: false,
          currentDosages: [{ dosage: '10mg', quantity: 1 }, { dosage: '20mg', quantity: 2 }],
          nextDosages: [{ dosage: '20mg', quantity: 2 }],
          prescribedDosages: { '10mg': 3, '20mg': 0, '40mg': 0 },
          intervalStartDate: new Date('2021-05-14T21:00:06.387Z'),
          intervalEndDate: new Date('2021-05-28T21:00:06.387Z'),
          intervalCount: 2,
          intervalUnit: 'Weeks',
          prevVisit: true,
          prescribedAt: new Date('2021-05-14T21:00:06.387Z'),
        },
        {
          id: 1,
          name: 'Sertraline',
          brand: 'Zoloft',
          form: 'tablet',
          measureUnit: '',
          minDosageUnit: 12.5,
          currentDosages: [{ dosage: '25mg', quantity: 0.5 }],
          nextDosages: [{ dosage: '25mg', quantity: 1 }],
          availableDosageOptions: ['12.5mg', '25mg', '50mg', '100mg'],
          prescribedDosages: { '25mg': 1, '50mg': 0, '100mg': 0 },
          allowSplittingUnscoredTablet: false,
          intervalStartDate: new Date('2021-05-14T21:13:39.673Z'),
          intervalEndDate: new Date('2021-05-28T21:13:39.673Z'),
          intervalCount: 2,
          intervalUnit: 'Weeks',
          prevVisit: true,
          prescribedAt: new Date('2021-05-14T21:13:39.673Z'),
        },
      ],
    },
  };
}

function* fetchTaperConfig(action: FetchTaperConfigRequestAction) {
  try {
    const result = fetchTaperConfigAPI(action);
    yield delay(1000);

    yield put<FetchTaperConfigSuccessAction>({
      type: FETCH_TAPER_CONFIG_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put<FetchTaperConfigFailureAction>({
      type: FETCH_TAPER_CONFIG_FAILURE,
      error: err.response.data,
    });
  }
}

function fetchPrescribedDrugsAPI(action: FetchPrescribedDrugsRequestAction): { data: PrescribedDrug[] } {
  return {
    data: [
      {
        id: 0,
        name: 'Fluoxetine',
        brand: 'Prozac',
        form: 'capsule',
        measureUnit: '',
        minDosageUnit: 5,
        availableDosageOptions: ['10mg', '20mg', '40mg'],
        allowSplittingUnscoredTablet: false,
        currentDosages: [{ dosage: '10mg', quantity: 1 }, { dosage: '20mg', quantity: 2 }],
        nextDosages: [{ dosage: '20mg', quantity: 2 }],
        prescribedDosages: { '10mg': 3, '20mg': 0, '40mg': 0 },
        intervalStartDate: new Date('2021-05-14T21:00:06.387Z'),
        intervalEndDate: new Date('2021-05-28T21:00:06.387Z'),
        intervalCount: 2,
        intervalUnit: 'Weeks',
        prevVisit: true,
        prescribedAt: new Date('2021-05-14T21:00:06.387Z'),
      },
      {
        id: 1,
        name: 'Sertraline',
        brand: 'Zoloft',
        form: 'tablet',
        measureUnit: '',
        minDosageUnit: 12.5,
        currentDosages: [{ dosage: '25mg', quantity: 0.5 }],
        nextDosages: [{ dosage: '25mg', quantity: 1 }],
        availableDosageOptions: ['12.5mg', '25mg', '50mg', '100mg'],
        prescribedDosages: { '25mg': 1, '50mg': 0, '100mg': 0 },
        allowSplittingUnscoredTablet: false,
        intervalStartDate: new Date('2021-05-14T21:13:39.673Z'),
        intervalEndDate: new Date('2021-05-28T21:13:39.673Z'),
        intervalCount: 2,
        intervalUnit: 'Weeks',
        prevVisit: true,
        prescribedAt: new Date('2021-05-14T21:13:39.673Z'),
      },
    ],
  };
}

function* fetchPrescribedDrugs(action: FetchPrescribedDrugsRequestAction) {
  try {
    yield delay(500);
    const result = fetchPrescribedDrugsAPI(action);
    console.log('result: ', result);

    yield put<FetchPrescribedDrugsSuccessAction>({
      type: FETCH_PRESCRIBED_DRUGS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put<FetchPrescribedDrugsFailureAction>({
      type: FETCH_PRESCRIBED_DRUGS_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchFetchTaperConfig() {
  yield takeLatest(FETCH_TAPER_CONFIG_REQUEST, fetchTaperConfig);
}

function* watchFetchPrescribedDrugs() {
  yield takeLatest(FETCH_PRESCRIBED_DRUGS_REQUEST, fetchPrescribedDrugs);
}

function* watchAddOrUpdateTaperConfig() {
  yield takeLatest(ADD_OR_UPDATE_TAPER_CONFIG_REQUEST, addOrUpdateTaperConfig);
}

export default function* taperConfigSaga() {
  yield all([
    fork(watchFetchTaperConfig),
    fork(watchFetchPrescribedDrugs),
    fork(watchAddOrUpdateTaperConfig),
  ]);
}
