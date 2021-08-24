import { Schedule } from '../components/Schedule/ProjectedSchedule';
import { ScheduleChartData } from '../utils/taperConfig';

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
  notes: string;
}

export interface TaperingConfiguration {
  id: number;
  clinicianId: number;
  patientId: number;
  createdAt: Date;
  projectedSchedule: Schedule;
  instructionsForPatient: string;
  instructionsForPharmacy: string;
  finalPrescription: Prescription;
  scheduleChartData: ScheduleChartData;
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

export type OralFormNames = 'oral solution' | 'oral suspension';
export type PillFormNames = 'capsule' | 'tablet';
// export type DrugFormNames = 'capsule' | 'tablet' | 'oral solution' | 'oral suspension';
export type DrugFormNames = OralFormNames | PillFormNames;
export interface PillForm {
  form: PillFormNames;
  measureUnit: string;
  dosages: PillDosage[];
}

export interface OralForm {
  form: OralFormNames;
  measureUnit: string;
  dosages: OralDosage;
}

export type DrugForm = PillForm | OralForm;

export interface PillDosage {
  dosage: string;
  isScored?: boolean;
}

export interface OralDosage {
  rate: { mg: number, ml: number },
  bottles: string[]
}

export const isCapsuleOrTablet = (form: DrugForm | PrescribedDrug): form is PillForm => {
  return form.form === 'tablet' || form.form === 'capsule';
};

export interface PrescribedDrug {
  id: number;
  name: string;
  brand: string;
  form: DrugFormNames | null;
  currentDosageForm: DrugFormNames | null;
  nextDosageForm: DrugFormNames | null;
  halfLife: string;
  measureUnit: string;
  minDosageUnit: number;

  /**
   * available dosage options including splitting tablet
   */
  availableDosageOptions: string[];

  /**
   * available dosage options without considering splitting tablet
   */
  regularDosageOptions: string[] | null;
  /**
   * In modal, keep setting false before adding to taperConfig state
   */
  applyInSchedule: boolean;
  isModal: boolean;
  /**
   * When opening a PrescriptionForm in Modal, it disallows to change prior dosage
   * unless drug name or brand are not changed.
   */
  allowChangePriorDosage: boolean;
  priorDosages: { dosage: string; quantity: number }[];
  upcomingDosages: { dosage: string; quantity: number }[];
  /**
   * priorDosageSum, upcomingDosageSum are used only in modal
   */
  priorDosageSum: number;
  upcomingDosageSum: number;
  targetDosage: number;
  growth: 'linear' | 'exponential';
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
  [drugName: string]: {
    // name: string,
    brand: string,
    form: DrugFormNames | null,
    oralDosageInfo: OralDosage | null;
    /*
    // available options for capsule or tablet
    availableDosages: string[];
     */
    regularDosageOptions: string[];
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
  rowIndexInPrescribedDrug: number;
  prescribedDrugId: number;
  prescribedDrug: PrescribedDrug;
  isPriorDosage: boolean;
  drug: string;
  brand: string;
  dosage: number;
  prescription: {
    message: string,
    data: {
      form: DrugFormNames | null,
      unit: string,
      intervalCount: number;
      intervalUnit: 'Days' | 'Weeks' | 'Months' | null;
      intervalDurationDays: number;
      oralDosageInfo?: OralDosage
      dosage: { [dosage: string]: number },
    }
  } | null;
  startDate: Date | null,
  endDate: Date | null,
  selected: boolean,
  /**
   * Includes Oral solution
   */
  availableDosageOptions: string[] | null;

  /**
   * In case of capsule or tablet
   */
  regularDosageOptions: string[] | null;
  /**
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
  form: DrugFormNames | null,
  currentDosageForm: DrugFormNames | null,
  nextDosageForm: DrugFormNames | null,
  goalDosage: number;
  changeDirection: 'increase'|'decrease'|'same';
}
