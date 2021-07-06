import { combineReducers } from 'redux';
import user from './user';
import taperConfig from './taperConfig/taperConfig';

const rootReducer = combineReducers({
  user,
  taperConfig,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
