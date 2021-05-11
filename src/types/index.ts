export interface Clinician {
  id: number;
  email: string;
  password: string;
  name: string;
  patients: Pick<Patient, 'id' | 'name' | 'image'>[];
  taperingConfigurations?: TaperingConfiguration[];
}

export interface Patient {
  id: number;
  email: string;
  password: string;
  name: string;
  image?: string;
  patientSignedUp?: boolean; // considering Clinician's adding patient account in the office
  taperingConfigurations: TaperingConfiguration[];
}

export interface TaperingConfiguration {
  id: number;
  clinicianId: number;
  patientId: number;
  createdAt: Date;
  drugs: PrescribedDrug[];
}

export interface Drug {
  name: string;
  options: DrugOption[]
}

export interface DrugOption {
  brand: string;
  forms: DrugForm[]
}

export interface DrugForm {
  form: string;
  measureUnit: string;
  dosages: { dosage: string; isScored?: boolean }[];
}

export interface PrescribedDrug {
  id: number;
  name: string;
  brand: string;
  form: string;
  measureUnit: string; // mg or ml..?
  minDosageUnit: number;
  availableDosageOptions: string[];
  currentDosages: { dosage: string; quantity: number }[];
  nextDosages: { dosage: string; quantity: number }[];
  prescribedDosages: { [dosage: string]: number; };
  allowSplittingUnscoredDosageUnit: boolean;
  intervalStartDate: Date;
  intervalEndDate: Date | null;
  intervalCount: number;
  intervalUnit: 'Days'|'Weeks'|'Months';
}
