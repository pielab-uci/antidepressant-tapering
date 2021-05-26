import * as React from 'react';
import {
  FC, useCallback, useContext, useRef, useState,
} from 'react';
import { Input } from 'antd';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { PrescriptionFormContext } from './PrescriptionForm';
import { TaperConfigActions } from '../../redux/reducers/taperConfig';
import { OralDosage } from '../../types';
import { useDosageSumAndDifferenceMessage } from '../../hooks/useDosageSumDifference';

interface Props {
  time: 'Prior'|'Upcoming'
}

const inputStyle = {
  width: 150,
};

const OralFormDosage: FC<Props> = ({ time }) => {
  const context = useContext(PrescriptionFormContext);
  const taperConfigActionDispatch = useDispatch<Dispatch<TaperConfigActions>>();
  const {
    formActionDispatch, id, chosenDrugForm, priorDosagesQty, upcomingDosagesQty,
  } = context;
  const { dosages, dosageChangeAction } = context[time];
  const dosage = useRef('1mg');
  const [mlDosage, setmlDosage] = useState(dosages['1mg']);
  const [dosageDifferenceMessage, dosageSum] = useDosageSumAndDifferenceMessage(time, priorDosagesQty, upcomingDosagesQty);

  const mgOnChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const mg = parseInt(e.target.value, 10);
    const ml = mg / (chosenDrugForm!.dosages as OralDosage).rate.mg * (chosenDrugForm!.dosages as OralDosage).rate.ml;
    const actionData = { id, dosage: { dosage: dosage.current, quantity: mg } };
    formActionDispatch(dosageChangeAction(actionData));
    taperConfigActionDispatch(dosageChangeAction(actionData));

    setmlDosage(ml);
  }, []);

  const mlOnChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const ml = parseInt(e.target.value, 10);
    setmlDosage(ml);
    const mg = ml / (chosenDrugForm!.dosages as OralDosage).rate.ml * (chosenDrugForm!.dosages as OralDosage).rate.mg;
    const actionData = { id, dosage: { dosage: dosage.current, quantity: mg } };
    formActionDispatch(dosageChangeAction(actionData));
    taperConfigActionDispatch(dosageChangeAction(actionData));
  }, []);

  return (
  <>
    <div>
    {time} Dosage
    </div>
    <div>
      <Input type='number' value={dosages['1mg']} onChange={mgOnChange} min={0} style={inputStyle}/> mg =
      <Input type='number' value={mlDosage} onChange={mlOnChange} min={0} style={inputStyle}/> ml
    </div>
    {time === 'Upcoming' && dosageDifferenceMessage
    && (
      <div style={{ color: 'red' }}>
        {dosageDifferenceMessage}
      </div>
    )}
    <div>
      Total: {dosageSum}
      {' '}
      {chosenDrugForm!.measureUnit}
    </div>
    </>
  );
};

export default OralFormDosage;
