import * as React from 'react';
import { useCallback, useContext, useMemo } from 'react';
import { Input } from 'antd';
import { differenceInDays } from 'date-fns';
import { PrescriptionFormContext } from './PrescriptionForm/PrescriptionForm';
import { prescribedQuantityChange } from './PrescriptionForm/actions';

const TotalQuantities = () => {
  const {
    chosenDrug, chosenBrand, chosenDrugForm,
    Next, prescribedDosagesQty, id, dispatch,
    intervalDurationDays,
  } = useContext(PrescriptionFormContext);

  const onCountChange = useCallback((e) => {
    console.log(e);
    dispatch(prescribedQuantityChange(
      { dosage: { dosage: e.target.title, quantity: parseInt(e.target.value, 10) }, id },
    ));
  }, [prescribedDosagesQty]);

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
