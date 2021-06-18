import * as React from 'react';
import {
  FC, useContext,
} from 'react';
import { css } from '@emotion/react';
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
      <h3 css={css`color: #636E72;
        font-size: 18px;`}>
        {time}
        {' '}
        Dosage
      </h3>
      <div css={css`display: flex;`}>
        <div css={css`
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 400px;
          margin-left: 64px;`}>
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
        <div css={css`display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          margin-left: 60px;`}>
          {time === 'Upcoming' && dosageDifferenceMessage
          && (
            <div css={css`color: red;`}>
              {dosageDifferenceMessage}
            </div>
          )}
          <div>
            Total:
            {dosageSum}
            {' '}
            {chosenDrugForm!.measureUnit}
          </div>
        </div>
      </div>
    </>
  );
};

export default CapsuleOrTabletDosages;
