import * as React from 'react';
import {
  FC, useCallback, useContext, useRef, useState,
} from 'react';
import Input from 'antd/es/input';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { css } from '@emotion/react';
import { PrescriptionFormContext } from './PrescriptionForm';
import { TaperConfigActions } from '../../redux/reducers/taperConfig';
import { OralDosage } from '../../types';
import useDosageSumDifferenceMessage from '../../hooks/useDosageSumDifferenceMessage';
import {
  priorDosageChange, PriorDosageChangeAction, upcomingDosageChange, UpcomingDosageChangeAction,
} from './actions';
import TargetDosageSettingForm from './TargetDosageSettingForm';

interface Props {
  time: 'Prior' | 'Upcoming';
  editable: boolean;
}

const inputStyle = {
  width: 150,
};

const OralFormDosage: FC<Props> = ({ time, editable }) => {
  const context = useContext(PrescriptionFormContext);
  const taperConfigActionDispatch = useDispatch<Dispatch<TaperConfigActions>>();
  const {
    formActionDispatch, id, chosenDrugForm, priorDosagesQty, upcomingDosagesQty,
    intervalDurationDays, oralDosageInfo,
  } = context;
  const { dosages } = context[time];
  const dosage = useRef('1mg');
  const [mlDosage, setmlDosage] = useState(dosages['1mg']);
  const [dosageDifferenceMessage, dosageSum] = useDosageSumDifferenceMessage(time, priorDosagesQty, upcomingDosagesQty);
  const dispatch = (action: UpcomingDosageChangeAction | PriorDosageChangeAction) => {
    formActionDispatch(action);
    taperConfigActionDispatch(action);
  };

  const mgOnChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const mg = parseInt(e.target.value, 10);
    const ml = mg / (chosenDrugForm!.dosages as OralDosage).rate.mg * (chosenDrugForm!.dosages as OralDosage).rate.ml;
    const actionData = { id, dosage: { dosage: dosage.current, quantity: mg } };
    if (time === 'Upcoming') {
      dispatch(upcomingDosageChange(actionData));
    } else {
      dispatch(priorDosageChange(actionData));
    }

    setmlDosage(ml);
  }, [chosenDrugForm, intervalDurationDays, upcomingDosagesQty, oralDosageInfo]);

  const mlOnChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const ml = parseInt(e.target.value, 10);
    setmlDosage(ml);
    const mg = ml / (chosenDrugForm!.dosages as OralDosage).rate.ml * (chosenDrugForm!.dosages as OralDosage).rate.mg;
    const actionData = { id, dosage: { dosage: dosage.current, quantity: mg } };
    if (time === 'Upcoming') {
      dispatch(upcomingDosageChange(actionData));
    } else {
      dispatch(priorDosageChange(actionData));
    }
  }, [chosenDrugForm, intervalDurationDays, upcomingDosagesQty, oralDosageInfo]);

  return (
    <>
      <h3 css={css`font-size: 1rem;
        color: #636E72;`}>
        {time} Dosage
      </h3>
      <div css={css`display: flex;
        flex-direction: column;`}>
        <div>
          <div css={css`
            display: flex;
            width: 500px;
            justify-content: space-between;
            margin-left: 90px;`}>
            <div>
              <Input type='number' value={dosages['1mg']} onChange={mgOnChange} readOnly={!editable} min={0} style={inputStyle}/> mg =
              <Input type='number' value={mlDosage} onChange={mlOnChange} readOnly={!editable} min={0} style={inputStyle}/> ml
            </div>
            <div>
              {time === 'Upcoming' && dosageDifferenceMessage
              && (
                <div css={css`color: #0984E3;`}>
                  {dosageDifferenceMessage}
                </div>
              )}
              <div>
                Total: {dosageSum}
                {' '}
                {chosenDrugForm!.measureUnit}
              </div>
            </div>
          </div>
          {time === 'Upcoming' && <TargetDosageSettingForm/>}
        </div>

      </div>
    </>
  );
};

export default OralFormDosage;
