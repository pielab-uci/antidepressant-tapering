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
  taperingConfiguration: TaperingConfiguration | null;
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
  halfLife: string;
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
  halfLife: string;
  measureUnit: string;
  minDosageUnit: number;
  availableDosageOptions: string[];
  regularDosageOptions: string[] | null;
  priorDosages: { dosage: string; quantity: number }[] | null;
  priorDosageSum: number | null;
  upcomingDosages: { dosage: string; quantity: number }[] | null;
  upcomingDosageSum: number | null;
  targetDosage: number;
  intervalStartDate: Date;
  intervalEndDate: Date | null;
  intervalCount: number;
  intervalUnit: 'Days' | 'Weeks' | 'Months';
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
    // available options for capsule or tablet
    availableDosages: string[];
    dosageQty: { [dosage: string]: number }
  }
}

export type ValueOf<T> = T[keyof T];

export interface Converted extends PrescribedDrug {
  intervalEndDate: Date;
  priorDosageSum: number;
  upcomingDosageSum: number;
  changeRate: number;
  changeAmount: number;
  // isIncreasing: boolean;
  changeDirection: 'increase' | 'decrease' | 'same';
}

export interface TableRowData {
  prescribedDrugId: number;
  prescribedDrug: PrescribedDrug;
  isPriorDosage: boolean;
  drug: string;
  brand: string;
  dosage: number;
  prescription: {
    message: string,
    data: {
      form: string,
      unit: string,
      dosage: { [dosage: string]: number },
    }
  } | null;
  startDate: Date | null,
  endDate: Date | null,
  selected: boolean,
  availableDosageOptions: string[] | null;
  regularDosageOptions: string[] | null;
  /*
     * dosages counts from upcoming dosages
     * or minimum quantity calculation without considering intervalDurationDays
     */
  unitDosages: { [dosage: string]: number } | null,
  addedInCurrentVisit: boolean,
  intervalDurationDays: number,
  intervalCount: number,
  intervalUnit: 'Days' | 'Weeks' | 'Months' | null,
  oralDosageInfo?: OralDosage,
  measureUnit: string,
  form: string
}
