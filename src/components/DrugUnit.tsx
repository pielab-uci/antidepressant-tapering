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
}

const DrugUnit: FC<Props> = ({ time, form, dosage }) => {
  const context = useContext(PrescriptionFormContext);
  const { formActionDispatch, id, intervalDurationDays } = context;
  const { dosages, action: dosageChangeAction } = context[time];
  const taperConfigActionDispatch = useDispatch<Dispatch<TaperConfigActions>>();

  // useEffect(() => {
  //   formActionDispatch(intervalDurationDaysChange({ durationDays: intervalDurationDays, id }));
  // }, [intervalDurationDays]);

  const onIncrement = useCallback(() => {
    const actionData = {
      id,
      dosage: {
        dosage,
        quantity: dosages[dosage] + 0.5,
      },
      // intervalDurationDays,
    };

    taperConfigActionDispatch(dosageChangeAction({ ...actionData, intervalDurationDays }));
    formActionDispatch(dosageChangeAction(actionData));
  }, [dosages, intervalDurationDays]);

  const onDecrement = useCallback(() => {
    const actionData = {
      id,
      dosage: {
        dosage,
        quantity: dosages[dosage] - 0.5,
      },
      // intervalDurationDays,
    };

    taperConfigActionDispatch(dosageChangeAction({ ...actionData, intervalDurationDays }));
    formActionDispatch(dosageChangeAction(actionData));
  }, [dosages, intervalDurationDays]);

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