export interface Clinician {
  id: number;
  email: string;
  password: string;
  name: string;
  taperingConfigurations: TaperingConfiguration[];
}

export interface Patient {
  id: number;
  email: string;
  password: string;
  name: string;
  image?: string;
  taperingConfigurations: TaperingConfiguration[];
}

export interface TaperingConfiguration {
  clinicianId: number;
  patient: Omit<Patient, "password">;
}
