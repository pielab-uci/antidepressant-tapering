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
    id, targetDosage, formActionDispatch, priorDosagesQty, priorDosageSum,
    upcomingDosagesQty, upcomingDosageSum, availableDosageOptions,
    modal: { isModal, modalDispatch },
  } = useContext(PrescriptionFormContext);
  const [targetDosageValid, setTargetDosageValid] = useState<boolean|null>(null);
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

  const isTargetDosageInvalid = (priorDosageSum: number, upcomingDosageSum: number, targetDosage: number, availableDosageOptions: string[]) => {
    const notValidIncreasing = priorDosageSum < upcomingDosageSum && targetDosage < upcomingDosageSum;
    const notValidDecreasing = priorDosageSum > upcomingDosageSum && targetDosage > upcomingDosageSum;
    const notValidSame = priorDosageSum === upcomingDosageSum && targetDosage !== upcomingDosageSum;
    const notDividable = availableDosageOptions.length !== 0 && !availableDosageOptions.map((option) => parseFloat(option))
      .some((option) => targetDosage % option === 0);

    console.group('TargetDosageSettingForm.isTargetDosageInvalid');
    if (notValidIncreasing) {
      console.group('notValidIncreasing');
      console.log('priorDosageSum: ', priorDosageSum);
      console.log('upcomingDosageSum: ', upcomingDosageSum);
      console.log('targetDosage: ', targetDosage);
      console.groupEnd();
    }

    if (notValidDecreasing) {
      console.group('notValidDecreasing');
      console.log('priorDosageSum: ', priorDosageSum);
      console.log('upcomingDosageSum: ', upcomingDosageSum);
      console.log('targetDosage: ', targetDosage);
      console.groupEnd();
    }

    if (notValidSame) {
      console.group('notValidSame');
      console.log('priorDosageSum: ', priorDosageSum);
      console.log('upcomingDosageSum: ', upcomingDosageSum);
      console.log('targetDosage: ', targetDosage);
      console.groupEnd();
    }

    if (notDividable) {
      console.log('notDividable');
      console.log('availableOptions: ', availableDosageOptions);
      console.log('priorDosageSum: ', priorDosageSum);
      console.log('upcomingDosageSum: ', upcomingDosageSum);
      console.log('targetDosage: ', targetDosage);
    }
    console.groupEnd();
    return notValidIncreasing || notValidDecreasing || notValidSame || notDividable;
  };

  useEffect(() => {
    // if ((priorDosageSum < upcomingDosageSum && targetDosage < upcomingDosageSum)
    //   || (priorDosageSum > upcomingDosageSum && targetDosage > upcomingDosageSum)
    //   || (priorDosageSum === upcomingDosageSum && targetDosage !== upcomingDosageSum)) {
    if (isTargetDosageInvalid(priorDosageSum, upcomingDosageSum, targetDosage, availableDosageOptions)) {
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
  }, [upcomingDosageSum, priorDosageSum, targetDosage]);

  const onChangeTargetDosage = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: SET_TARGET_DOSAGE,
      data: { id, dosage: parseFloat(e.target.value) },
    });
  };

  const onWheelEventHandler = (e: React.WheelEvent<HTMLInputElement>) => {
    e.currentTarget.blur();
  };

  const renderValidateErrorMessage = () => {
    const message = () => {
      if (!availableDosageOptions.map((option) => parseFloat(option)).some((option) => targetDosage % option === 0)) {
        return 'Target dosage cannot be made with the combination of given dosage options.';
      }

      if (priorDosageSum < upcomingDosageSum) {
        return 'When you increase the dosage, target dosage must be more than upcoming dosage.';
      }

      if (priorDosageSum > upcomingDosageSum) {
        return 'When you decrease the dosage, target dosage must be less than upcoming dosage.';
      }

      return 'When you do not make any change to the dosage, target dosage must be equal to upcoming dosage.';
    };

    return <div css={css`color: red;
    margin-left: 20px;`}>
      Invalid target dosage.<br/>
      {message()}
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
                 onWheel={onWheelEventHandler}
                 min={0}
                 css={css`width: 100px;
                 display: inline;
               `}/> mg
        </div>
        {targetDosageValid !== null && !targetDosageValid && renderValidateErrorMessage()}
      </div>
    </div>
  );
};
export default TargetDosageSettingForm;
