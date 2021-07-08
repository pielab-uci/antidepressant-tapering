import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import Input from 'antd/es/input';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { css } from '@emotion/react';
import { PrescriptionFormContext } from './PrescriptionForm';
import { TaperConfigActions } from '../../redux/reducers/taperConfig';
import {
  SET_TARGET_DOSAGE,
  SetUpcomingDosageGoalAction,
} from './actions';
import { SET_IS_INPUT_COMPLETE, VALIDATE_INPUT_COMPLETION } from '../../redux/actions/taperConfig';

const TargetDosageSettingForm = () => {
  const {
    id, targetDosage, formActionDispatch, priorDosagesQty, upcomingDosagesQty, modal: { isModal, modalDispatch },
  } = useContext(PrescriptionFormContext);
  const [targetDosageValid, setTargetDosageValid] = useState(false);
  const taperConfigActionDispatch = useDispatch<Dispatch<TaperConfigActions>>();
  const dispatch = (action: SetUpcomingDosageGoalAction) => {
    if (isModal) {
      formActionDispatch(action);
      modalDispatch!(action);
    } else {
      formActionDispatch(action);
      taperConfigActionDispatch(action);
    }
  };

  const [dosageChange, setDosageChange] = useState<'increase' | 'decrease' | 'same' | null>(null);

  useEffect(() => {
    const priorDosageSum = Object.entries(priorDosagesQty)
      .reduce((prev, [dosage, qty]) => prev + parseFloat(dosage) * qty, 0);
    const upcomingDosageSum = Object.entries(upcomingDosagesQty)
      .reduce((prev, [dosage, qty]) => prev + parseFloat(dosage) * qty, 0);

    if (priorDosageSum > upcomingDosageSum) {
      setDosageChange('decrease');
    } else if (priorDosageSum < upcomingDosageSum) {
      setDosageChange('increase');
    } else {
      setDosageChange('same');
    }

    if ((dosageChange === 'increase' && targetDosage < upcomingDosageSum)
      || (dosageChange === 'decrease' && targetDosage > upcomingDosageSum)
      || (dosageChange === 'same' && targetDosage !== upcomingDosageSum)) {
      setTargetDosageValid(false);
      taperConfigActionDispatch({
        type: SET_IS_INPUT_COMPLETE,
        data: { isComplete: false },
      });
    } else {
      setTargetDosageValid(true);
      taperConfigActionDispatch({
        type: VALIDATE_INPUT_COMPLETION,
      });
    }
  }, [upcomingDosagesQty, priorDosagesQty, targetDosage]);

  const onChangeTargetDosage = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: SET_TARGET_DOSAGE,
      data: { id, dosage: parseFloat(e.target.value) },
    });
  };

  const renderValidateErrorMessage = () => {
    const detail = () => {
      if (dosageChange === 'increase') {
        return 'When you increase the dosage, target dosage must be more than upcoming dosage.';
      }
      if (dosageChange === 'decrease') {
        return 'When you decrease the dosage, target dosage must be less than upcoming dosage.';
      }
      return 'When you do not make any change to the dosage, target dosage must be equal to upcoming dosage.';
    };

    return <div css={css`color: red;
      margin-left: 20px;`}>
      Invalid target dosage.<br/>
      {detail()}
    </div>;
  };

  return (
    <div css={css`
      display: flex;
      margin-top: 44px;
      flex-direction: column;`}>
      <div css={css`font-size: 0.9rem;
        display: flex;
        //flex-direction: column;
        align-items: center;
      `}>
        <h3 css={css`font-size: 1rem;
          color: #636E72;`}>Target dosage:</h3>
        <div css={css`display: flex;
          //margin-left: 64px;
          align-items: center;
          margin-left: 10px;

          & input::-webkit-inner-spin-button,
          & input::-webkit-outer-spin-button {
            -webkit-appearance: none;
            opacity: 0;
            margin: 0;
          }

          & input[type=number] {
            -moz-appearance: textfield;
          }`}>
          <Input type='number'
                 value={targetDosage}
                 onChange={onChangeTargetDosage}
                 min={0}
                 css={css`width: 100px;
                   display: inline;
                 `}/> mg
        </div>
        {!targetDosageValid && renderValidateErrorMessage()}
      </div>
    </div>
  );
};
export default TargetDosageSettingForm;
