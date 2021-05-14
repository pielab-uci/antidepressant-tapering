import {
  all, put, fork, takeLatest, delay,
} from 'redux-saga/effects';
import { Schedule } from '../../components/ProjectedSchedule';
import {
  ADD_OR_UPDATE_TAPER_CONFIG_FAILURE,
  ADD_OR_UPDATE_TAPER_CONFIG_REQUEST,
  ADD_OR_UPDATE_TAPER_CONFIG_SUCCESS,
  AddOrUpdateTaperConfigFailureAction,
  AddOrUpdateTaperConfigRequestAction,
  AddOrUpdateTaperConfigSuccessAction,
  FETCH_TAPER_CONFIG_FAILURE,
  FETCH_TAPER_CONFIG_REQUEST,
  FETCH_TAPER_CONFIG_SUCCESS,
  FetchTaperConfigFailureAction,
  FetchTaperConfigRequestAction,
  FetchTaperConfigSuccessAction,
} from '../actions/taperConfig';
import { TaperingConfiguration } from '../../types';

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
    put<AddOrUpdateTaperConfigFailureAction>({
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
      createdAt: new Date(),
      prescribedDrugs: [
        {
          id: 0,
          name: 'Fluoxetine',
          brand: 'Prozac',
          form: 'capsule',
          measureUnit: '',
          minDosageUnit: 5,
          availableDosageOptions: ['10mg', '20mg', '40mg'],
          currentAllowSplittingUnscoredDosageUnit: false,
          nextAllowSplittingUnscoredDosageUnit: false,
          currentDosages: [{ dosage: '10mg', quantity: 1 }, { dosage: '20mg', quantity: 2 }],
          nextDosages: [{ dosage: '20mg', quantity: 2 }],
          prescribedDosages: { '10mg': 3 },
          intervalStartDate: new Date('2021-05-14T21:00:06.387Z'),
          intervalEndDate: new Date('2021-05-28T21:00:06.387Z'),
          intervalCount: 2,
          intervalUnit: 'Weeks',
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
          prescribedDosages: { '25mg': 1 },
          currentAllowSplittingUnscoredDosageUnit: false,
          nextAllowSplittingUnscoredDosageUnit: false,
          intervalStartDate: new Date('2021-05-14T21:13:39.673Z'),
          intervalEndDate: new Date('2021-05-28T21:13:39.673Z'),
          intervalCount: 2,
          intervalUnit: 'Weeks',
        },
      ],
    },
  };
}

function* fetchTaperConfig(action: FetchTaperConfigRequestAction) {
  try {
    yield delay(1000);
    const result = fetchTaperConfigAPI(action);

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

function* watchFetchTaperConfig() {
  yield takeLatest(FETCH_TAPER_CONFIG_REQUEST, fetchTaperConfig);
}

function* watchAddOrUpdateTaperConfig() {
  yield takeLatest(ADD_OR_UPDATE_TAPER_CONFIG_REQUEST, addOrUpdateTaperConfig);
}

export default function* taperConfigSaga() {
  yield all([fork(watchFetchTaperConfig), fork(watchAddOrUpdateTaperConfig)]);
}
