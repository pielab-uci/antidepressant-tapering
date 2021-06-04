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

export interface CapsuleOrTabletForm {
  form: string;
  measureUnit: string;
  dosages: CapsuleOrTabletDosage[];
}

export interface OralForm {
  form: string;
  measureUnit: string;
  dosages: OralDosage;
}

export type DrugForm = CapsuleOrTabletForm | OralForm;

export interface CapsuleOrTabletDosage {
  dosage: string;
  isScored?: boolean;
}

export interface OralDosage {
  rate: { mg: number, ml: number },
  bottles: string[]
}

export const isCapsuleOrTablet = (form: DrugForm | PrescribedDrug): form is CapsuleOrTabletForm => {
  return form.form === 'tablet' || form.form === 'capsule';
};

export interface PrescribedDrug {
  id: number;
  name: string;
  brand: string;
  form: string;
  measureUnit: string;
  minDosageUnit: number;
  availableDosageOptions: string[];
  regularDosageOptions: string[]|null;
  priorDosages: { dosage: string; quantity: number }[];
  upcomingDosages: { dosage: string; quantity: number }[];
  intervalStartDate: Date;
  intervalEndDate: Date | null;
  intervalCount: number;
  intervalUnit: 'Days'|'Weeks'|'Months';
  intervalDurationDays: number;
  allowSplittingUnscoredTablet: boolean;
  prevVisit: boolean;
  prescribedAt: Date;
  oralDosageInfo?: OralDosage | null;
}

export interface Prescription {
  [id: number]: {
    name: string,
    brand: string,
    form: string,
    oralDosageInfo: OralDosage | null;
    dosageQty: { [dosage: string]: number }
    // TODO: add projected schedule here..?
  }
}

export type ValueOf<T> = T[keyof T];
