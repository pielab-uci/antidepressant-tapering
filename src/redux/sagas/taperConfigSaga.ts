import {
  all, put, fork, takeLatest, delay,
} from 'redux-saga/effects';
import { Schedule } from '../../components/ProjectedSchedule';
import {
  ADD_OR_UPDATE_TAPER_CONFIG_FAILURE, ADD_OR_UPDATE_TAPER_CONFIG_REQUEST, ADD_OR_UPDATE_TAPER_CONFIG_SUCCESS,
  AddOrUpdateTaperConfigFailureAction,
  AddOrUpdateTaperConfigRequestAction, AddOrUpdateTaperConfigSuccessAction,
  FETCH_PAST_SCHEDULE_DATA_FAILURE, FETCH_PAST_SCHEDULE_DATA_REQUEST,
  FETCH_PAST_SCHEDULE_DATA_SUCCESS, FetchPastScheduleDataFailure,
  FetchPastScheduleDataRequest,
  FetchPastScheduleDataSuccess,
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

function fetchPastScheduleDataAPI(currentDosageDate: Date): Schedule {
  // fetch a schedule that was ended most recently if there is
  return {
    data: [],
    drugs: [],
  };
}

function* fetchPastScheduleData(action: FetchPastScheduleDataRequest) {
  try {
    yield delay(1000);
    // const result = fetchPastScheduleDataAPI(action.data);

    yield put<FetchPastScheduleDataSuccess>({
      type: FETCH_PAST_SCHEDULE_DATA_SUCCESS,
    });
  } catch (err) {
    console.error(err);
    yield put<FetchPastScheduleDataFailure>({
      type: FETCH_PAST_SCHEDULE_DATA_FAILURE,
    });
  }
}

function* watchFetchingPastScheduleData() {
  yield takeLatest(FETCH_PAST_SCHEDULE_DATA_REQUEST, fetchPastScheduleData);
}

function* watchAddOrUpdateTaperConfig() {
  yield takeLatest(ADD_OR_UPDATE_TAPER_CONFIG_REQUEST, addOrUpdateTaperConfig);
}

export default function* taperConfigSaga() {
  yield all([fork(watchFetchingPastScheduleData), fork(watchAddOrUpdateTaperConfig)]);
}
