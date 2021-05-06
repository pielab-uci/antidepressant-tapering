import * as React from 'react';
import {
  FC, useContext, useEffect, useState,
} from 'react';
import DrugUnit from './DrugUnit';
import { PrescriptionFormContext } from './PrescriptionForm/PrescriptionForm';

interface Props {
  time: 'Current' | 'Next';
  dosages: { [key: string]: number }
}

const Dosages: FC<Props> = ({ time, dosages }) => {
  const {
    chosenDrugForm, dosageOptions, currentDosagesQty, nextDosagesQty,
  } = useContext(PrescriptionFormContext);
  const unit = Object.keys(dosages)[0].match(/[a-z]+/);
  const [dosageDifferencePercent, setDosageDifferencePercent] = useState<string | null>(null);

  const calculateDosageSum = (dosages: { [key: string]: number }): number => Object.entries(dosages).reduce((acc, [dosage, count]) => acc + parseFloat(dosage) * count, 0);

  useEffect(() => {
    if (time === 'Next') {
      const currentDosageSum = calculateDosageSum(currentDosagesQty);
      const nextDosageSum = calculateDosageSum(nextDosagesQty);
      if (currentDosageSum === 0) {
        setDosageDifferencePercent(null);
      } else {
        setDosageDifferencePercent(
          ((nextDosageSum - currentDosageSum) / currentDosageSum * 100).toFixed(2),
        );
      }
    }
  }, [currentDosagesQty, nextDosagesQty]);

  return (
    <>
      <div>
        {time}
        {' '}
        Dosage
      </div>
      <div style={{ display: 'flex' }}>
        {dosageOptions.map((v) => (
          <DrugUnit
            key={`${time}_${chosenDrugForm!.form}_${v}`}
            time={time}
            form={chosenDrugForm!.form}
            dosage={v}
          />
        ))}
      </div>
      {time === 'Next' && dosageDifferencePercent
      && (
      <div style={{ color: 'red' }}>
        {dosageDifferencePercent}
        % change
      </div>
      )}
      <div>
        Total:
        {calculateDosageSum(dosages)}
        {' '}
        {unit}
      </div>
    </>
  );
};

export default Dosages;
