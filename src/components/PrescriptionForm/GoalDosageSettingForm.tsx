import * as React from 'react';
import {
  useCallback, useContext, useEffect, useState,
} from 'react';
import Input from 'antd/es/input';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { css } from '@emotion/react';
import { PrescriptionFormContext } from './PrescriptionForm';
import { TaperConfigActions } from '../../redux/reducers/taperConfig';
import {
  SET_GOAL_DOSAGE,
  SetNextDosageGoalAction,
} from './actions';
import { SET_IS_INPUT_COMPLETE, VALIDATE_INPUT_COMPLETION } from '../../redux/actions/taperConfig';

const GoalDosageSettingForm = () => {
  const {
    id, goalDosage, formActionDispatch, currentDosagesQty, currentDosageSum,
    nextDosagesQty, nextDosageSum, availableDosageOptions,
    modal: { isModal, modalDispatch },
  } = useContext(PrescriptionFormContext);
  const [goalDosageValid, setGoalDosageValid] = useState<boolean|null>(null);
  const taperConfigActionDispatch = useDispatch<Dispatch<TaperConfigActions>>();
  const dispatch = (action: SetNextDosageGoalAction) => {
    if (isModal) {
      formActionDispatch(action);
      modalDispatch!(action);
    } else {
      formActionDispatch(action);
      taperConfigActionDispatch(action);
    }
  };

  const isGoalDosageInvalid = useCallback((currentDosageSum: number, nextDosageSum: number, goalDosage: number, availableDosageOptions: string[]) => {
    const notValidIncreasing = currentDosageSum < nextDosageSum && goalDosage < nextDosageSum;
    const notValidDecreasing = currentDosageSum > nextDosageSum && goalDosage > nextDosageSum;
    const notValidSame = currentDosageSum === nextDosageSum && goalDosage !== nextDosageSum;
    const notDividable = availableDosageOptions.length !== 0 && !availableDosageOptions.map((option) => parseFloat(option))
      .some((option) => goalDosage % option === 0);

    console.group('TargetDosageSettingForm.isTargetDosageInvalid');
    if (notValidIncreasing) {
      console.group('notValidIncreasing');
      console.log('currentDosageSum: ', currentDosageSum);
      console.log('nextDosageSum: ', nextDosageSum);
      console.log('goalDosage: ', goalDosage);
      console.groupEnd();
    }

    if (notValidDecreasing) {
      console.group('notValidDecreasing');
      console.log('priorDosageSum: ', currentDosageSum);
      console.log('nextDosageSum: ', nextDosageSum);
      console.log('goalDosage: ', goalDosage);
      console.groupEnd();
    }

    if (notValidSame) {
      console.group('notValidSame');
      console.log('priorDosageSum: ', currentDosageSum);
      console.log('nextDosageSum: ', nextDosageSum);
      console.log('goalDosage: ', goalDosage);
      console.groupEnd();
    }

    if (notDividable) {
      console.log('notDividable');
      console.log('availableOptions: ', availableDosageOptions);
      console.log('priorDosageSum: ', currentDosageSum);
      console.log('nextDosageSum: ', nextDosageSum);
      console.log('goalDosage: ', goalDosage);
    }
    console.groupEnd();
    return notValidIncreasing || notValidDecreasing || notValidSame || notDividable;
  }, []);

  useEffect(() => {
    // TODO: to refactor..
    // if ((priorDosageSum < upcomingDosageSum && targetDosage < upcomingDosageSum)
    //   || (priorDosageSum > upcomingDosageSum && targetDosage > upcomingDosageSum)
    //   || (priorDosageSum === upcomingDosageSum && targetDosage !== upcomingDosageSum)) {
    if (isGoalDosageInvalid(currentDosageSum, nextDosageSum, goalDosage, availableDosageOptions)) {
      setGoalDosageValid(false);
      if (isModal) {
        modalDispatch!({
          type: SET_IS_INPUT_COMPLETE,
          data: { isComplete: false },
        });
      } else {
        taperConfigActionDispatch({
          type: SET_IS_INPUT_COMPLETE,
          data: { isComplete: false },
        });
      }
    } else {
      setGoalDosageValid(true);
      if (isModal) {
        modalDispatch!({
          type: VALIDATE_INPUT_COMPLETION,
          data: { isGoalDosageValid: true },
        });
      } else {
        taperConfigActionDispatch({
          type: VALIDATE_INPUT_COMPLETION,
          data: { isGoalDosageValid: true },
        });
      }
    }
  }, [nextDosageSum, currentDosageSum, goalDosage]);

  const onChangeGoalDosage = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: SET_GOAL_DOSAGE,
      data: { id, dosage: parseFloat(e.target.value) },
    });
  };

  const onWheelEventHandler = (e: React.WheelEvent<HTMLInputElement>) => {
    e.currentTarget.blur();
  };

  const renderValidateErrorMessage = () => {
    const message = () => {
      if (!availableDosageOptions.map((option) => parseFloat(option)).some((option) => goalDosage % option === 0)) {
        return 'Goal dosage cannot be made with the combination of given dosage options.';
      }

      if (currentDosageSum < nextDosageSum) {
        return 'When you increase the dosage, goal dosage must be more than next dosage.';
      }

      if (currentDosageSum > nextDosageSum) {
        return 'When you decrease the dosage, goal dosage must be less than next dosage.';
      }

      return 'When you do not make any change to the dosage, goal dosage must be equal to next dosage.';
    };

    return <div css={css`color: red;
    margin-left: 20px;`}>
      Invalid goal dosage.<br/>
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
        color: #636E72;`}>Goal dosage:</h3>
        <div css={css`display: flex;
        //margin-left: 64px;
        align-items: center;
        margin-left: 24px;

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
                 value={goalDosage}
                 onChange={onChangeGoalDosage}
                 onWheel={onWheelEventHandler}
                 min={0}
                 // disabled={isModal}
                 css={css`width: 100px;
                 display: inline;
               `}/> mg
        </div>
        {goalDosageValid !== null && !goalDosageValid && renderValidateErrorMessage()}
      </div>
    </div>
  );
};
export default GoalDosageSettingForm;
