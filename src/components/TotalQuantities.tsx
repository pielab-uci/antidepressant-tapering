import * as React from 'react';
import {
  useCallback, useContext, useEffect, useMemo,
} from 'react';
import { Input } from 'antd';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { PrescriptionFormContext } from './PrescriptionForm/PrescriptionForm';
import { intervalDurationDaysChange, prescribedQuantityChange } from './PrescriptionForm/actions';
import { TaperConfigActions } from '../redux/reducers/taperConfig';

const TotalQuantities = () => {
  const {
    chosenDrug, chosenBrand, chosenDrugForm,
    Next, prescribedDosagesQty, id, formActionDispatch,
    intervalDurationDays,
  } = useContext(PrescriptionFormContext);

  const taperConfigActionDispatch = useDispatch<Dispatch<TaperConfigActions>>();

  useEffect(() => {
    formActionDispatch(intervalDurationDaysChange({ durationDays: intervalDurationDays, id }));
  }, [intervalDurationDays]);

  const onCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const actionData = {
      dosage: { dosage: e.target.title, quantity: parseFloat(e.target.value) },
      id,
    };

    formActionDispatch(prescribedQuantityChange(actionData));
    taperConfigActionDispatch(prescribedQuantityChange({ ...actionData, intervalDurationDays }));
  };
  // useCallback((e) => {
  // }, [prescribedDosagesQty, intervalDurationDays]);
  return (
    <div>
      <h3>Total number of {chosenDrug?.name}({chosenBrand?.brand}) {chosenDrugForm?.form}</h3>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {Object.keys(Next.dosages).map((key) => (
          <div key={`${id}_${key}_${Next.dosages[key]}`}>
            <h4>{key}:</h4>
            <Input
              title={key}
              style={{ display: 'inline-block' }}
              type="number"
              min={0}
              defaultValue={Next.dosages[key] * intervalDurationDays}
              value={prescribedDosagesQty[key]}
              step={0.5}
              width={'50px'}
              onChange={onCountChange}/>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TotalQuantities;