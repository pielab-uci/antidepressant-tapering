import { combineReducers } from 'redux';
import user from './user';
import taperConfig from './taperConfig/taperConfig';
import taperConfigAsyncReducer from './taperConfig/asyncs';

const rootReducer = combineReducers({
  user,
  taperConfig,
  taperConfigAsyncReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
