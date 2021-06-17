import * as React from 'react';
import {
  FC, useCallback, useContext,
} from 'react';
import { Button } from 'antd';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { css } from '@emotion/react';
import { PrescriptionFormContext } from './PrescriptionForm';
import { TaperConfigActions } from '../../redux/reducers/taperConfig';
import {
  priorDosageChange, PriorDosageChangeAction, upcomingDosageChange, UpcomingDosageChangeAction,
} from './actions';
import {
  ArrowDown, ArrowUp, ScoredTablet, UnscoredTablet,
} from '../../icons';

interface Props {
  form: string;
  time: 'Prior' | 'Upcoming'
  dosage: string;
  isScored?: boolean;
}

const CapsuleOrTabletUnit: FC<Props> = ({
  time, form, dosage, isScored,
}) => {
  const context = useContext(PrescriptionFormContext);
  const {
    formActionDispatch, id, intervalDurationDays, allowSplittingUnscoredTablet,
  } = context;
  const { dosages } = context[time];
  const taperConfigActionDispatch = useDispatch<Dispatch<TaperConfigActions>>();
  const dispatch = (action: UpcomingDosageChangeAction | PriorDosageChangeAction) => {
    formActionDispatch(action);
    taperConfigActionDispatch(action);
  };

  const quantity = (change: 'increment' | 'decrement', dosages: { [dosage: string]: number }, dosage: string) => {
    if (isScored) {
      return change === 'increment' ? dosages[dosage] + 0.5 : dosages[dosage] - 0.5;
    }
    return change === 'increment' ? dosages[dosage] + 1 : dosages[dosage] - 1;
  };

  const onIncrement = useCallback(() => {
    const actionData = {
      id,
      dosage: {
        dosage,
        quantity: quantity('increment', dosages, dosage),
      },
    };

    if (time === 'Upcoming') {
      dispatch(upcomingDosageChange(actionData));
    } else {
      dispatch(priorDosageChange(actionData));
    }
  }, [dosages, intervalDurationDays, allowSplittingUnscoredTablet]);

  const onDecrement = useCallback(() => {
    const actionData = {
      id,
      dosage: {
        dosage,
        quantity: quantity('decrement', dosages, dosage),
      },
    };

    if (time === 'Upcoming') {
      dispatch(upcomingDosageChange(actionData));
    } else {
      dispatch(priorDosageChange(actionData));
    }
  }, [dosages, intervalDurationDays, allowSplittingUnscoredTablet]);

  const renderIcon = () => {
    if (form === 'tablet') {
      if (isScored) {
        return <ScoredTablet value={dosages[dosage]}/>;
      }
      return <UnscoredTablet value={dosages[dosage]}/>;
    }
    return <div>capsule: {dosages[dosage]}</div>;
  };
  return (
    <div css={css`display: flex;`}>
      <div css={css`display: flex;
        flex-direction: column;
        justify-content: center;`}>
        <div onClick={onIncrement}>
          <ArrowUp/>
        </div>
        <div css={css`margin-top: 20px;`}onClick={onDecrement}>
          <ArrowDown/>
        </div>
      </div>
      {renderIcon()}
    </div>);
};

export default CapsuleOrTabletUnit;
