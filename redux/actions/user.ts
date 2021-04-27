import { User } from '../../types';

export const LOGIN_REQUEST = "LOGIN_REQUEST" as const;
export const LOGIN_SUCCESS = "LOGIN_SUCCESS" as const;
export const LOGIN_FAILURE = "LOGIN_FAILURE" as const;

export interface LoginRequestAction {
  type: typeof LOGIN_REQUEST;
  data: { email: string; password: string }
}

export interface LoginSuccessAction {
  type: typeof LOGIN_SUCCESS;
  data: Omit<User, "password">
}

export interface LoginFailureAction {
  type: typeof LOGIN_FAILURE;
  error: any;
}



