export interface User {
  email: string;
  password: string;
  role: "clinician"|"patient";
  taperingConfigurations: TaperingConfiguration[];
}

export interface TaperingConfiguration {
  clinician: Omit<User, "password"|"taperingConfigurations">;
  patient: Omit<User, "password"|"taperingConfigurations">;
}
