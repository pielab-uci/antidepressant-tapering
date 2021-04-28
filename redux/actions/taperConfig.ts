import {TaperingConfiguration} from "../../types";

export const ADD_TAPER_CONFIG_REQUEST = 'ADD_TAPER_CONFIG_REQUEST' as const;
export const ADD_TAPER_CONFIG_SUCCESS = 'ADD_TAPER_CONFIG_SUCCESS' as const;
export const ADD_TAPER_CONFIG_FAILURE = 'ADD_TAPER_CONFIG_FAILURE' as const;

export interface AddTaperConfigRequestAction {
  type: typeof ADD_TAPER_CONFIG_REQUEST,
  data: any;
}

export interface AddTaperConfigSuccessAction {
  type: typeof ADD_TAPER_CONFIG_SUCCESS,
  data: TaperingConfiguration
}

export interface AddTaperConfigFailureAction {
  type: typeof ADD_TAPER_CONFIG_FAILURE,
  error: any;
}

