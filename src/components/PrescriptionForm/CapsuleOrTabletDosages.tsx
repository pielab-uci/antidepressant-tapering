import * as React from 'react';
import {
  FC, useContext,
} from 'react';
import CapsuleOrTabletUnit from './CapsuleOrTabletUnit';
import { PrescriptionFormContext } from './PrescriptionForm';
import { CapsuleOrTabletDosage } from '../../types';
import { useDosageSumAndDifferenceMessage } from '../../hooks/useDosageSumDifference';

interface Props {
  time: 'Prior' | 'Upcoming';
  dosages: { [key: string]: number }
}

const CapsuleOrTabletDosages: FC<Props> = ({ time, dosages }) => {
  const context = useContext(PrescriptionFormContext);
  const {
    chosenDrugForm, dosageOptions, priorDosagesQty, upcomingDosagesQty,
  } = context;
  const [dosageDifferenceMessage, dosageSum] = useDosageSumAndDifferenceMessage(time, priorDosagesQty, upcomingDosagesQty);

  return (
    <>
      <div>
        {time}
        {' '}
        Dosage
      </div>
      <div style={{ display: 'flex' }}>
        {(dosageOptions as CapsuleOrTabletDosage[])
          .map((v: { dosage: string; isScored?: boolean }, i) => (
          <CapsuleOrTabletUnit
            key={`${time}_${chosenDrugForm!.form}_${v.dosage}`}
            time={time}
            form={chosenDrugForm!.form}
            dosage={v.dosage}
            isScored={v.isScored ? v.isScored : undefined}
            isMinDosage={i === 0}
          />))
        }
      </div>
      {time === 'Upcoming' && dosageDifferenceMessage
      && (
      <div style={{ color: 'red' }}>
        {dosageDifferenceMessage}
      </div>
      )}
      <div>
        Total:
        {dosageSum}
        {' '}
        {chosenDrugForm!.measureUnit}
      </div>
    </>
  );
};

export default CapsuleOrTabletDosages;
