import * as React from 'react';
import {
  FC, useCallback, useContext, useEffect, useState,
} from 'react';
import { useDispatch } from 'react-redux';
import DrugUnit from './DrugUnit';
import { PrescriptionFormContext } from './PrescriptionForm/PrescriptionForm';

interface Props {
  time: 'Prior' | 'Upcoming';
  dosages: { [key: string]: number }
}

const Dosages: FC<Props> = ({ time, dosages }) => {
  const context = useContext(PrescriptionFormContext);
  const {
    chosenDrugForm, dosageOptions, priorDosagesQty, upcomingDosagesQty, id,
    formActionDispatch,
  } = context;
  const taperConfigActionDispatch = useDispatch();
  const unit = chosenDrugForm!.measureUnit;
  const [dosageDifferencePercent, setDosageDifferencePercent] = useState<string | null>(null);
  const calculateDosageSum = (dosages: { [key: string]: number }): number => Object
    .entries(dosages)
    .reduce((acc, [dosage, count]) => acc + parseFloat(dosage) * count, 0);

  useEffect(() => {
    if (time === 'Upcoming') {
      const priorDosageSum = calculateDosageSum(priorDosagesQty);
      const upcomingDosageSum = calculateDosageSum(upcomingDosagesQty);
      if (priorDosageSum === 0) {
        setDosageDifferencePercent(null);
      } else {
        setDosageDifferencePercent(
          ((upcomingDosageSum - priorDosageSum) / priorDosageSum * 100).toFixed(2),
        );
      }
    }
  }, [priorDosagesQty, upcomingDosagesQty]);

  return (
    <>
      <div>
        {time}
        {' '}
        Dosage
      </div>
      <div style={{ display: 'flex' }}>
        {dosageOptions.map((v: { dosage: string; isScored?: boolean }, i) => (
          <DrugUnit
            key={`${time}_${chosenDrugForm!.form}_${v.dosage}`}
            time={time}
            form={chosenDrugForm!.form}
            dosage={v.dosage}
            isScored={v.isScored ? v.isScored : undefined}
            isMinDosage={i === 0}
          />))
        }
      </div>
      {time === 'Upcoming' && dosageDifferencePercent
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
