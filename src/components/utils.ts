import { differenceInCalendarDays } from 'date-fns';
import { DrugForm, isCapsuleOrTablet, OralDosage } from '../types';

const subtractDosageOptionsFromDosage = (dosage: number, dosageOptions: string[]): [number, { [dosage: string]: number }] => {
  const dosages: { [dosage: string]: number } = {};
  let d = dosage;
  dosageOptions.concat()
    .sort((a, b) => parseFloat(b) - parseFloat(a))
    .forEach((dos) => {
      const quot = Math.floor(d / parseFloat(dos));
      if (quot >= 1) {
      // while (quot >= 1) {
        dosages[dos] = quot;
        d -= quot * parseFloat(dos);
      }
    });

  return [d, dosages];
};

export const calcMinimumQuantityForDosage = (availableOptions: string[], dosage: number, regularDosageOptions: string[]|null): { [dosageQty: string]: number } => {
  if (dosage === 0) {
    const putZeros = (prev: { [p: string]: number }, option: string) => {
      prev[option] = 0;
      return prev;
    };

    if (regularDosageOptions) {
      return regularDosageOptions.reduce(putZeros, {});
    }
    return availableOptions.reduce(putZeros, {});
  }

  if (regularDosageOptions) { // in case of tablet or capsules
    const [d, dosages] = subtractDosageOptionsFromDosage(dosage, regularDosageOptions);

    if (d > 0) {
      const splittingOption = availableOptions.find((option) => parseFloat(option) === d);
      if (!splittingOption) {
        console.error('dosage case not covered.');
        return dosages;
      }

      const dosageToAdd = regularDosageOptions.find((dos) => parseFloat(splittingOption) / parseFloat(dos) === 0.5);
      if (!dosageToAdd) {
        console.error('dosage case not covered. - no dosage to split');
        return dosages;
      }
      if (dosages[dosageToAdd]) {
        dosages[dosageToAdd] += 0.5;
      } else {
        dosages[dosageToAdd] = 0.5;
      }
    }
    return dosages;
  }

  // oral solution / suspense
  let [d, dosages] = subtractDosageOptionsFromDosage(dosage, availableOptions);

  if (Object.values(dosages).every((qty) => qty === 0)) {
    dosages[availableOptions[0]] = 1;
    d = 0;
  }

  if (d > 0) {
    dosages[availableOptions[0]] += 1;
  }
  return dosages;
};

export const calcIntervalDurationDays = (startDate: Date, endDate: Date|null) => {
  return !endDate ? 0 : differenceInCalendarDays(endDate, startDate) + 1;
};

export const calcPrescribedDosageQty = (args: {
  chosenDrugForm: DrugForm|null|undefined,
  intervalDurationDays: number,
  upcomingDosagesQty: { [dosage: string]: number },
  oralDosageInfo: OralDosage | null }) => {
  const {
    chosenDrugForm, intervalDurationDays, upcomingDosagesQty, oralDosageInfo,
  } = args;
  if (!chosenDrugForm || chosenDrugForm.form === '') {
    return {};
  }

  if (isCapsuleOrTablet(chosenDrugForm)) {
    return Object.entries(upcomingDosagesQty).reduce((prev: { [p: string]:number }, [dosage, qty]) => {
      prev[dosage] = qty * intervalDurationDays;
      return prev;
    }, {});
  }

  const dosageSum = upcomingDosagesQty['1mg'] * intervalDurationDays / chosenDrugForm.dosages.rate.mg * chosenDrugForm.dosages.rate.ml;
  return calcMinimumQuantityForDosage(oralDosageInfo!.bottles, dosageSum, null);
};
