import {
  all, fork, put, select, takeLatest,
} from 'redux-saga/effects';
import {
  ADD_OR_UPDATE_TAPER_CONFIG_FAILURE,
  ADD_OR_UPDATE_TAPER_CONFIG_REQUEST,
  ADD_OR_UPDATE_TAPER_CONFIG_SUCCESS,
  AddOrUpdateTaperConfigFailureAction,
  AddOrUpdateTaperConfigRequestAction,
  AddOrUpdateTaperConfigSuccessAction,
  CLEAR_SCHEDULE,
  ClearScheduleAction,
  FETCH_TAPER_CONFIG_FAILURE,
  FETCH_TAPER_CONFIG_REQUEST,
  FETCH_TAPER_CONFIG_SUCCESS,
  FetchTaperConfigFailureAction,
  FetchTaperConfigRequestAction,
  FetchTaperConfigSuccessAction,
  GENERATE_SCHEDULE,
  GenerateScheduleAction, INIT_NEW_TAPER_CONFIG, InitNewTaperConfigAction,
  MOVE_FROM_CREATE_TO_PRESCRIBE_PAGE,
  MoveFromCreateToPrescribePage,
  TABLE_DOSAGE_EDITED,
  TABLE_END_DATE_EDITED,
  TABLE_START_DATE_EDITED,
  UPDATE_CHART,
  UpdateChartAction,
} from '../actions/taperConfig';
import { Prescription } from '../../types';
import { completePrescribedDrugs, ScheduleChartData } from '../reducers/utils';
import { TaperConfigState } from '../reducers/taperConfig';
import { Schedule } from '../../components/Schedule/ProjectedSchedule';

let taperConfigId = 0;

function* generateOrClearSchedule() {
  const taperConfigState: TaperConfigState = yield select((state) => state.taperConfig);

  const validPrescribedDrugsInputs = completePrescribedDrugs(taperConfigState.prescribedDrugs);
  if (validPrescribedDrugsInputs.length !== 0) {
    yield put<GenerateScheduleAction>({
      type: GENERATE_SCHEDULE,
      data: validPrescribedDrugsInputs,
    });
  } else if (taperConfigState.currentTaperConfigId && taperConfigState.taperConfigs.find((config) => config.id === taperConfigState.currentTaperConfigId)) {

  } else {
    yield put<ClearScheduleAction>({
      type: CLEAR_SCHEDULE,
    });
  }
}

//
// function addOrUpdateTaperConfigAPI(action: AddOrUpdateTaperConfigRequestAction): { data: TaperingConfiguration } {
//   if (taperConfigState.taperConfigs.findIndex((config) => config.patientId === action.data.patientId && config.clinicianId === action.data.clinicianId)) {
//     return action.data;
//   }
//
//   taperConfigId += 1;
//   return {
//     data: {
//       id: taperConfigId,
//       ...action.data,
//       createdAt: new Date(),
//     },
//   };
// }

function* addOrUpdateTaperConfig(action: AddOrUpdateTaperConfigRequestAction) {
  try {
    // yield delay(1000);
    // const result = addOrUpdateTaperConfigAPI(action);
    const taperConfigState: TaperConfigState = yield select((state) => state.taperConfig);

    const existingTaperConfigIndex = taperConfigState.taperConfigs.findIndex((config) => config.patientId === action.data.patientId && config.clinicianId === action.data.clinicianId);

    if (existingTaperConfigIndex) {
      yield put<AddOrUpdateTaperConfigSuccessAction>({
        type: ADD_OR_UPDATE_TAPER_CONFIG_SUCCESS,
        data: {
          ...taperConfigState.taperConfigs[existingTaperConfigIndex],
          ...action.data,
          id: taperConfigId,
          createdAt: new Date(),
        },
      });
    } else {
      taperConfigId += 1;
      yield put<AddOrUpdateTaperConfigSuccessAction>({
        type: ADD_OR_UPDATE_TAPER_CONFIG_SUCCESS,
        data: { ...action.data, id: taperConfigId, createdAt: new Date() },
      });
    }
  } catch (err) {
    console.error(err);
    yield put<AddOrUpdateTaperConfigFailureAction>({
      type: ADD_OR_UPDATE_TAPER_CONFIG_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchAddOrUpdateTaperConfig() {
  yield takeLatest(ADD_OR_UPDATE_TAPER_CONFIG_REQUEST, addOrUpdateTaperConfig);
}

// function fetchTaperConfigAPI(action: FetchTaperConfigRequestAction): { data: TaperingConfiguration } {
//   return {
//     data: {
//       id: action.data,
//       clinicianId: 1,
//       patientId: 1,
//       createdAt: new Date('2021-05-14T21:00:06.387Z'),
//       projectedSchedule: { drugs: [] as PrescribedDrug[], data: [] as TableRowData[] },
//       finalPrescription: {} as Prescription,
//       instructionsForPatient: '',
//       instructionsForPharmacy: '',
//       scheduleChartData: {} as ScheduleChartData,
//     },
//   };
// }

function* fetchTaperConfig(action: FetchTaperConfigRequestAction) {
  try {
    // const result = fetchTaperConfigAPI(action);
    // yield delay(1000);

    const taperConfigState: TaperConfigState = yield select((state) => state.taperConfig);

    const taperConfigIndex = taperConfigState.taperConfigs.findIndex((config) => config.patientId === action.data.patientId && config.clinicianId === action.data.clinicianId);
    if (taperConfigIndex !== -1) {
      yield put<FetchTaperConfigSuccessAction>({
        type: FETCH_TAPER_CONFIG_SUCCESS,
        data: taperConfigState.taperConfigs[taperConfigIndex],
      });
    } else {
      // add new taper config
      taperConfigId += 1;
      yield put<InitNewTaperConfigAction>({
        type: INIT_NEW_TAPER_CONFIG,
        data: { clinicianId: action.data.clinicianId, patientId: action.data.patientId },
      });
      // yield put<FetchTaperConfigSuccessAction>({
      //   type: FETCH_TAPER_CONFIG_SUCCESS,
      //   data: {
      //     id: taperConfigId,
      //     clinicianId: action.data.clinicianId,
      //     patientId: action.data.patientId,
      //     createdAt: new Date(),
      //     projectedSchedule: {} as Schedule,
      //     instructionsForPharmacy: '',
      //     instructionsForPatient: '',
      //     finalPrescription: {} as Prescription,
      //     scheduleChartData: [] as ScheduleChartData,
      //   },
      // });
    }

    // yield generateOrClearSchedule();
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

function* updateChart() {
  yield put<UpdateChartAction>({
    type: UPDATE_CHART,
  });
}

function* moveToPrescribePage() {
  const taperConfigState: TaperConfigState = yield select((state) => state.taperConfig);
  const { prescribedDrugs, isInputComplete } = taperConfigState;
  if (prescribedDrugs && prescribedDrugs.length !== 0 && isInputComplete) {
    yield generateOrClearSchedule();
  }
}

function* watchTaperConfigFormChange() {
  yield takeLatest([MOVE_FROM_CREATE_TO_PRESCRIBE_PAGE,
    // EDIT_PROJECTED_SCHEDULE_FROM_MODAL
  ],
  // generateOrClearSchedule);
  moveToPrescribePage);
}

function* watchProjectedScheduleTableEdit() {
  yield takeLatest([TABLE_DOSAGE_EDITED, TABLE_START_DATE_EDITED, TABLE_END_DATE_EDITED], updateChart);
}

export default function* taperConfigSaga() {
  yield all([
    fork(watchFetchTaperConfig),
    fork(watchAddOrUpdateTaperConfig),
    fork(watchTaperConfigFormChange),
    fork(watchProjectedScheduleTableEdit),
  ]);
}
