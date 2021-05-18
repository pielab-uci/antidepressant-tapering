import * as React from 'react';
import {
  FC, useCallback, useContext,
} from 'react';
import { Button } from 'antd';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { PrescriptionFormContext } from './PrescriptionForm/PrescriptionForm';
import { TaperConfigActions } from '../redux/reducers/taperConfig';

interface Props {
  form: string;
  time: 'Current' | 'Next'
  dosage: string;
  isScored?: boolean;
  isMinDosage: boolean;
}

const DrugUnit: FC<Props> = ({
  time, form, dosage, isScored, isMinDosage,
}) => {
  const context = useContext(PrescriptionFormContext);
  const {
    formActionDispatch, id, intervalDurationDays, allowSplittingUnscoredTablet,
  } = context;
  const { dosages, dosageChangeAction } = context[time];
  const taperConfigActionDispatch = useDispatch<Dispatch<TaperConfigActions>>();

  const quantity = (change: 'increment' | 'decrement', dosages: { [dosage: string]: number }, dosage: string) => {
    // if (isMinDosage) {
    //   if (isScored || allowSplittingUnscored) {
    //     return change === 'increment' ? dosages[dosage] + 0.5 : dosages[dosage] - 0.5;
    //   }
    //   return change === 'increment' ? dosages[dosage] + 1 : dosages[dosage] - 1;
    // }

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

    taperConfigActionDispatch(dosageChangeAction({ ...actionData, intervalDurationDays }));
    formActionDispatch(dosageChangeAction(actionData));
  }, [dosages, intervalDurationDays, allowSplittingUnscoredTablet]);

  const onDecrement = useCallback(() => {
    const actionData = {
      id,
      dosage: {
        dosage,
        quantity: quantity('decrement', dosages, dosage),
      },
    };

    taperConfigActionDispatch(dosageChangeAction({ ...actionData, intervalDurationDays }));
    formActionDispatch(dosageChangeAction(actionData));
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

export default DrugUnit;
