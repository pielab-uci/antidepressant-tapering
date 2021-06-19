import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { Input } from 'antd';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { css } from '@emotion/react';
import { PrescriptionFormContext } from './PrescriptionForm';
import { TaperConfigActions } from '../../redux/reducers/taperConfig';
import {
  SET_UPCOMING_DOSAGE_GOAL,
  SetUpcomingDosageGoalAction,
} from './actions';
import { SET_IS_INPUT_COMPLETE, VALIDATE_INPUT_COMPLETION } from '../../redux/actions/taperConfig';

const TargetDosageSettingForm = () => {
  const {
    id, targetDosage, formActionDispatch, priorDosagesQty, upcomingDosagesQty,
  } = useContext(PrescriptionFormContext);
  const [targetDosageValid, setTargetDosageValid] = useState(false);
  const taperConfigActionDispatch = useDispatch<Dispatch<TaperConfigActions>>();
  const dispatch = (action: SetUpcomingDosageGoalAction) => {
    formActionDispatch(action);
    taperConfigActionDispatch(action);
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

  const onChangeUpcomingDosageGoal = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: SET_UPCOMING_DOSAGE_GOAL,
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
      margin: 20px 0 0 30px;
      flex-direction: column;`}>
      <div css={css`font-size: 0.9rem;
        display: flex;
        align-items: center;
        margin-top: 15px;`}>
        <label>Target dosage:</label>
        <div css={css`display: flex;
          align-items: center;`}>
          <Input type='number'
                 value={targetDosage || undefined}
                 onChange={onChangeUpcomingDosageGoal}
                 min={0}
                 css={css`width: 100px;
                   display: inline;`}/> mg
        </div>
        {!targetDosageValid && renderValidateErrorMessage()}
      </div>
    </div>
  );
};
export default TargetDosageSettingForm;
