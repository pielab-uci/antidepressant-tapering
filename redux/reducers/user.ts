import {
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LoginFailureAction,
  LoginRequestAction,
  LoginSuccessAction
} from "../actions/user";
import produce from "immer";
import {User} from "../../types";

export interface UserState {
  loggingIn: boolean;
  loggedIn: boolean;
  logInError: any;

  me: Omit<User, 'password'>|null
}

export const initialState: UserState = {
  loggingIn: false,
  loggedIn: false,
  logInError: null,
  me: null
}


type UserReducerAction =
  | LoginRequestAction
  | LoginSuccessAction
  | LoginFailureAction;

const userReducer = (state: UserState = initialState, action: UserReducerAction): UserState => {
  return produce(state, (draft) => {
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

      default:
        return state;
    }
  })
}


export default userReducer;
