import * as React from 'react';
import { FC, useRef } from 'react';
import { css } from '@emotion/react';
import { SerializedStyles } from '@emotion/utils';
import { DrugForm, isCapsuleOrTablet } from '../types';
import { CapsuleOrTabletDosages, OralFormDosage } from './PrescriptionForm';

interface Props {
  drugForm: DrugForm | null | undefined,
  time: 'Prior' | 'Upcoming'
  editable?: boolean;
}

const Dosages: FC<Props> = ({ drugForm, time, editable }) => {
  const containerStyle = useRef<SerializedStyles>(css`
      margin-top: 44px;`);

  if (!drugForm) {
    return <div css={containerStyle.current}>
      <h3 css={css`font-size: 1rem;
        color: #c7c5c5;
        margin-bottom: 121px;`}>{time} Dosage</h3>
    </div>;
  }

  if (isCapsuleOrTablet(drugForm)) {
    return (
      <div css={containerStyle.current}>
        <CapsuleOrTabletDosages time={time}/>
      </div>
    );
  }

  return (
    <div css={containerStyle.current}>
      <OralFormDosage time={time}/>
    </div>
  );
};

export default Dosages;