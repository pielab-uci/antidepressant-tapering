import * as React from 'react';
import {
  useCallback, useContext, useEffect, useMemo,
} from 'react';
import { Input } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { PrescriptionFormContext } from './PrescriptionForm/PrescriptionForm';
import { intervalDurationDaysChange, prescribedQuantityChange } from './PrescriptionForm/actions';
import { RootState } from '../redux/reducers';
import { TaperConfigActions, TaperConfigState } from '../redux/reducers/taperConfig';

const TotalQuantities = () => {
  const {
    chosenDrug, chosenBrand, chosenDrugForm,
    Next, prescribedDosagesQty, id, formActionDispatch,
  } = useContext(PrescriptionFormContext);

  const taperConfigActionDispatch = useDispatch<Dispatch<TaperConfigActions>>();
  const { intervalDurationDays } = useSelector<RootState, TaperConfigState>((state) => state.taperConfig);

  useEffect(() => {
    formActionDispatch(intervalDurationDaysChange(intervalDurationDays));
  }, [intervalDurationDays]);

  const onCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const actionData = {
      dosage: { dosage: e.target.title, quantity: parseFloat(e.target.value) },
      id,
      intervalDurationDays,
    };

    formActionDispatch(prescribedQuantityChange(actionData));
    taperConfigActionDispatch(prescribedQuantityChange(actionData));
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
              max={Next.dosages[key] * intervalDurationDays}
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
