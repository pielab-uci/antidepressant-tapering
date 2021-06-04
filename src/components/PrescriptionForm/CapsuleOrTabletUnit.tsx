import * as React from 'react';
import {
  FC, useCallback, useContext,
} from 'react';
import { Button } from 'antd';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { PrescriptionFormContext } from './PrescriptionForm';
import { TaperConfigActions } from '../../redux/reducers/taperConfig';
import { calcPrescribedDosageQty } from '../utils';
import {
  priorDosageChange, PriorDosageChangeAction, upcomingDosageChange, UpcomingDosageChangeAction,
} from './actions';

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
    chosenDrugForm, upcomingDosagesQty, oralDosageInfo,
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

  return (
    <>
      <div>
        {form}
        :
        {' '}
        {dosage}
      </div>
      <Button onClick={onIncrement}>+</Button>
      <div>{dosages[dosage]}</div>
      <Button onClick={onDecrement}>-</Button>
    </>
  );
};

export default CapsuleOrTabletUnit;
