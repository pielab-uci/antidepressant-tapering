import * as React from 'react';
import {
  FC, useContext,
} from 'react';
import { css } from '@emotion/react';
import PillUnit from './PillUnit';
import { PrescriptionFormContext } from './PrescriptionForm';
import { PillDosage } from '../../types';
import useDosageSumDifferenceMessage from '../../hooks/useDosageSumDifferenceMessage';
import SelectGrowth from './SelectGrowth';

interface Props {
  time: 'Current' | 'Next';
  editable: boolean;
}

const PillDosages: FC<Props> = ({ time, editable }) => {
  const context = useContext(PrescriptionFormContext);
  const {
    chosenDrugForm, dosageOptions, currentDosageSum, nextDosageSum, growth,
    currentDosageForm, nextDosageForm,
    currentDosageOptions, nextDosageOptions,
  } = context;
  const dosageDifferenceMessage = useDosageSumDifferenceMessage(time, currentDosageSum, nextDosageSum, growth);

  return (
    <>
      <h3 css={css`color: #636E72;
        font-size: 1rem;`}>
        {time}
        {' '}
        Dosage
      </h3>
      <div css={css`display: flex;
        flex-direction: column;`}>
        <div css={css`display: flex;`}>
          <div css={css`
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 400px;
            margin-left: 64px;`}>
            {/* {(dosageOptions as CapsuleOrTabletDosage[]) */}
            {((time === 'Current' ? currentDosageOptions : nextDosageOptions) as PillDosage[])
              .map((v: { dosage: string; isScored?: boolean }) => (
                <PillUnit
                  // key={`${time}_${chosenDrugForm!.form}_${v.dosage}`}
                  key={time === 'Current' ? `Current_${currentDosageForm}_${v.dosage}` : `Next_${nextDosageForm}_${v.dosage}`}
                  time={time}
                  editable={editable}
                  form={time === 'Current' ? (currentDosageForm as 'capsule' | 'tablet') : (nextDosageForm as 'capsule' | 'tablet')}
                  // form={chosenDrugForm!.form}
                  dosage={v.dosage}
                  isScored={v.isScored ? v.isScored : undefined}
                />))
            }
          </div>
          <div css={css`display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: center;
            margin-left: 64px;`}>
            {time === 'Next' && dosageDifferenceMessage
            && (
              <div css={css`color: #0984E3;`}>
                {dosageDifferenceMessage}
              </div>
            )}
            <div>
              Total:
              {/* {dosageSum} */}
              {time === 'Next' ? nextDosageSum : currentDosageSum}
              {' '}
              {chosenDrugForm!.measureUnit}
            </div>
          </div>
        </div>
      </div>
      {time === 'Next' && <SelectGrowth/>}
    </>
  );
};
export default PillDosages;
