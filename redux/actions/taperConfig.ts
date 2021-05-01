import {TaperingConfiguration} from "../../types";

export const ADD_TAPER_CONFIG_REQUEST = 'ADD_TAPER_CONFIG_REQUEST' as const;
export const ADD_TAPER_CONFIG_SUCCESS = 'ADD_TAPER_CONFIG_SUCCESS' as const;
export const ADD_TAPER_CONFIG_FAILURE = 'ADD_TAPER_CONFIG_FAILURE' as const;

export const ADD_NEW_DRUG_FORM = "ADD_NEW_DRUG_FORM" as const;
export const REMOVE_DRUG_FORM = "REMOVE_DRUG_FORM" as const;

export const GENERATE_SCHEDULE = "GENERATE_SCHEDULE" as const;
export const CLEAR_SCHEDULE = "CLEAR_SCHEDULE" as const;

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

export interface AddNewDrugFormAction {
  type: typeof ADD_NEW_DRUG_FORM
}

export interface RemoveDrugFormAction {
  type: typeof REMOVE_DRUG_FORM,
  data: number;
}

export interface GenerateScheduleAction {
  type: typeof GENERATE_SCHEDULE
}

export interface ClearScheduleAction {
  type: typeof CLEAR_SCHEDULE
}
