import * as React from 'react';
import {
  FC, useContext,
} from 'react';
import CapsuleOrTabletUnit from './CapsuleOrTabletUnit';
import { PrescriptionFormContext } from './PrescriptionForm';
import { CapsuleOrTabletDosage } from '../../types';
import useDosageSumDifferenceMessage from '../../hooks/useDosageSumDifferenceMessage';

interface Props {
  time: 'Prior' | 'Upcoming';
}

const CapsuleOrTabletDosages: FC<Props> = ({ time }) => {
  const context = useContext(PrescriptionFormContext);
  const {
    chosenDrugForm, dosageOptions, priorDosagesQty, upcomingDosagesQty,
  } = context;
  const [dosageDifferenceMessage, dosageSum] = useDosageSumDifferenceMessage(time, priorDosagesQty, upcomingDosagesQty);

  return (
    <>
      <div>
        {time}
        {' '}
        Dosage
      </div>
      <div style={{ display: 'flex' }}>
        {(dosageOptions as CapsuleOrTabletDosage[])
          .map((v: { dosage: string; isScored?: boolean }) => (
          <CapsuleOrTabletUnit
            key={`${time}_${chosenDrugForm!.form}_${v.dosage}`}
            time={time}
            form={chosenDrugForm!.form}
            dosage={v.dosage}
            isScored={v.isScored ? v.isScored : undefined}
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
