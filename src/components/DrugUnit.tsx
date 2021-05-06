import * as React from 'react';
import {
  FC, useCallback, useContext,
} from 'react';
import { Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { PrescriptionFormContext } from './PrescriptionForm/PrescriptionForm';
import { RootState } from '../redux/reducers';
import { TaperConfigActions, TaperConfigState } from '../redux/reducers/taperConfig';

interface Props {
  form: string;
  time: 'Current' | 'Next'
  dosage: string;
}

const DrugUnit: FC<Props> = ({ time, form, dosage }) => {
  const context = useContext(PrescriptionFormContext);
  const { formActionDispatch, id } = context;
  const { dosages, action: dosageChangeAction } = context[time];
  const { intervalDurationDays } = useSelector<RootState, TaperConfigState>((state) => state.taperConfig);
  const taperConfigActionDispatch = useDispatch<Dispatch<TaperConfigActions>>();

  const onIncrement = useCallback(() => {
    const actionData = {
      id,
      dosage: {
        dosage,
        quantity: dosages[dosage] + 0.5,
      },
      intervalDurationDays,
    };

    formActionDispatch(dosageChangeAction(actionData));
    taperConfigActionDispatch(dosageChangeAction(actionData));
  }, [dosages]);

  const onDecrement = useCallback(() => {
    const actionData = {
      id,
      dosage: {
        dosage,
        quantity: dosages[dosage] - 0.5,
      },
      intervalDurationDays,
    };

    formActionDispatch(dosageChangeAction(actionData));
    taperConfigActionDispatch(dosageChangeAction(actionData));
  }, [dosages]);

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
