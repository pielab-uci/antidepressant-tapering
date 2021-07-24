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

interface Props {
  time: 'Current' | 'Next';
  editable: boolean;
}

const inputStyle = {
  width: 150,
};

const OralFormDosage: FC<Props> = ({ time, editable }) => {
  const context = useContext(PrescriptionFormContext);
  const taperConfigActionDispatch = useDispatch<Dispatch<TaperConfigActions>>();
  const {
    formActionDispatch, id, chosenDrugForm, upcomingDosagesQty,
    priorDosageSum, upcomingDosageSum,
    intervalDurationDays, oralDosageInfo, modal: { isModal, modalDispatch },
  } = context;
  const { dosages } = context[time];
  const dosage = useRef('1mg');
  const [mlDosage, setmlDosage] = useState((dosages['1mg'] / oralDosageInfo!.rate.mg) * oralDosageInfo!.rate.ml);

  const dosageDifferenceMessage = useDosageSumDifferenceMessage(time, priorDosageSum, upcomingDosageSum);
  const dispatch = (action: UpcomingDosageChangeAction | PriorDosageChangeAction) => {
    if (isModal) {
      formActionDispatch(action);
      modalDispatch!(action);
    } else {
      formActionDispatch(action);
      taperConfigActionDispatch(action);
    }
  };

  const mgOnChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { rate } = chosenDrugForm!.dosages as OralDosage;
    const input = parseInt(e.target.value, 10);
    const ml = (input / rate.mg) * rate.ml;
    const mg = (ml / rate.ml) * rate.mg;

    const actionData = { id, dosage: { dosage: dosage.current, quantity: mg } };

    if (actionData.dosage.quantity >= 0) {
      if (time === 'Next') {
        dispatch(upcomingDosageChange(actionData));
      } else {
        dispatch(priorDosageChange(actionData));
      }
    }

    setmlDosage(ml);
  }, [chosenDrugForm, intervalDurationDays, priorDosageSum, upcomingDosageSum, oralDosageInfo]);

  const mlOnChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const ml = parseInt(e.target.value, 10);
    const { rate } = chosenDrugForm!.dosages as OralDosage;
    setmlDosage(ml);
    const mg = (ml / rate.ml) * rate.mg;
    const actionData = { id, dosage: { dosage: dosage.current, quantity: mg } };

    if (actionData.dosage.quantity >= 0) {
      if (time === 'Next') {
        dispatch(upcomingDosageChange(actionData));
      } else {
        dispatch(priorDosageChange(actionData));
      }
    }
  }, [chosenDrugForm, intervalDurationDays, priorDosageSum, upcomingDosageSum, oralDosageInfo]);

  return (
    <>
      <h3 css={css`font-size: 1rem;
        color: #636E72;`}>
        {time} Dosage
      </h3>
      <div css={css`display: flex;
        flex-direction: column;`}>
        <div css={css`display: flex;`}>
          <div css={css`
            display: flex;
            width: 550px;
            height: 50px;
            align-items: center;
            justify-content: space-between;
            margin-left: 64px;`}>
            <div>
               <Input type='number'
                     value={dosages['1mg']}
                     onChange={mgOnChange}
                     readOnly={!editable}
                     min={0}
                     style={inputStyle}/> mg =
               <Input type='number'
                     value={mlDosage}
                     onChange={mlOnChange}
                     readOnly={!editable}
                     min={0}
                     style={inputStyle}/> ml
            </div>
          </div>
          <div css={css`
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: center;
            margin-left: 20px;`}>
            {time === 'Next' && dosageDifferenceMessage
            && (
              <div css={css`color: #0984E3;`}>
                {dosageDifferenceMessage}
              </div>
            )}
            <div>
              Total:
              {time === 'Next' ? upcomingDosageSum : priorDosageSum}
              {' '}
              {chosenDrugForm!.measureUnit}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OralFormDosage;
