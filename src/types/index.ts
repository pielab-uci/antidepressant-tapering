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
  taperingConfiguration: Pick<TaperingConfiguration, 'id'> | null;
  recentVisit: Date;
}

export interface TaperingConfiguration {
  id: number;
  clinicianId: number;
  patientId: number;
  createdAt: Date;
  prescribedDrugs: PrescribedDrug[];
}

export interface Drug {
  name: string;
  options: DrugOption[]
}

export interface DrugOption {
  brand: string;
  forms: DrugForm[]
}

export interface CapsuleTabletForm {
  form: string;
  measureUnit: string;
  dosages: CapsuleTabletDosage[];
}

export interface OralForm {
  form: string;
  measureUnit: string;
  dosages: OralDosage;
}

export type DrugForm = CapsuleTabletForm | OralForm;

export interface CapsuleTabletDosage {
  dosage: string;
  isScored?: boolean;
}

export interface OralDosage {
  rate: { mg: number, ml: number },
  bottles: string[]
}

export const isCapsuleOrTablet = (form: DrugForm): form is CapsuleTabletForm => {
  return form.form === 'tablet' || form.form === 'capsule';
};

export interface PrescribedDrug {
  id: number;
  name: string;
  brand: string;
  form: string;
  measureUnit: string; // TODO: remove measureUnit variable?
  minDosageUnit: number;
  availableDosageOptions: string[];
  priorDosages: { dosage: string; quantity: number }[];
  upcomingDosages: { dosage: string; quantity: number }[];
  prescribedDosages: { [dosage: string]: number; };
  allowSplittingUnscoredTablet: boolean;
  prevVisit: boolean;
  intervalStartDate: Date;
  intervalEndDate: Date | null;
  intervalCount: number;
  intervalUnit: 'Days'|'Weeks'|'Months';
  prescribedAt: Date;
  oralDosageInfo?: OralDosage | null;
}
