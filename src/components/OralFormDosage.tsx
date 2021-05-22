import * as React from 'react';
import {
  FC, useCallback, useContext, useRef, useState,
} from 'react';
import { Input } from 'antd';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { PrescriptionFormContext } from './PrescriptionForm/PrescriptionForm';
import { TaperConfigActions } from '../redux/reducers/taperConfig';
import { OralDosage } from '../types';

interface Props {
  time: 'Prior'|'Upcoming'
  // dosages: { [key: string]: number }
}

const inputStyle = {
  width: 150,
};

const OralFormDosage: FC<Props> = ({ time }) => {
  const context = useContext(PrescriptionFormContext);
  const taperConfigActionDispatch = useDispatch<Dispatch<TaperConfigActions>>();
  const { formActionDispatch, id, chosenDrugForm } = context;
  const { dosages, dosageChangeAction } = context[time];
  const dosage = useRef('1mg');
  const [mlDosage, setmlDosage] = useState(dosages['1mg']); // TODO: bring OralDosage - rate
  const [dosageDifference, setDosageDifference] = useState<string|null>(null);
  const calculateDosageSum = () => {};

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

    const mg = ml * (chosenDrugForm!.dosages as OralDosage).rate.ml / (chosenDrugForm!.dosages as OralDosage).rate.mg;
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
    {time === 'Upcoming' && dosageDifference
    && (
      <div style={{ color: 'red' }}>
        {dosageDifference}
      </div>
    )}
    </>
  );
};

export default OralFormDosage;
