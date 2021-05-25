import * as React from 'react';
import {
  useCallback,
  useContext,
} from 'react';
import { Input } from 'antd';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { PrescriptionFormContext } from './PrescriptionForm';
import { prescribedQuantityChange } from './actions';
import { TaperConfigActions } from '../../redux/reducers/taperConfig';
import { DrugForm, isCapsuleOrTablet } from '../../types';

const PrescribedDosageQuantities = () => {
  const {
    chosenDrug, chosenBrand, chosenDrugForm,
    Upcoming, prescribedDosagesQty, id, formActionDispatch,
    intervalDurationDays,
  } = useContext(PrescriptionFormContext);

  const taperConfigActionDispatch = useDispatch<Dispatch<TaperConfigActions>>();

  const onCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const actionData = {
      dosage: { dosage: e.target.title, quantity: parseFloat(e.target.value) },
      id,
    };

    formActionDispatch(prescribedQuantityChange(actionData));
    taperConfigActionDispatch(prescribedQuantityChange({ ...actionData, intervalDurationDays }));
  };

  const renderQuantities = useCallback((chosenDrugForm: DrugForm | null | undefined, prescribedDosagesQty: { [dosage: string]: number }) => {
    if (chosenDrugForm) {
      if (isCapsuleOrTablet(chosenDrugForm)) {
        return (
          <>
            {Object.keys(prescribedDosagesQty).map((key) => (
              <div key={`${id}_${key}_${Upcoming.dosages[key]}`}>
                <h4>{key}:</h4>
                <Input
                  title={key}
                  style={{ display: 'inline-block' }}
                  type="number"
                  min={0}
                  defaultValue={Upcoming.dosages[key] * intervalDurationDays}
                  value={prescribedDosagesQty[key]}
                  step={0.5}
                  width={'50px'}
                  onChange={onCountChange}/>
              </div>
            ))}
          </>
        );
      }
      return (
        <>
          {chosenDrugForm.dosages.bottles.map((bottle) => (
            <div key={`${id}_${bottle}`}>
              <h4>{bottle}:</h4>
              <Input title={bottle}
                     style={{ display: 'inline-block' }}
                     type="number"
                     min={0}
                     defaultValue={prescribedDosagesQty[bottle]}
                     value={prescribedDosagesQty[bottle]}
                     step={1}
                     width={'50px'}
                     onChange={onCountChange}/>
            </div>
          ))}
        </>
      );
    }
    return <></>;
  }, []);

  return (
    <div>
      <h3>Prescription of {chosenDrug?.name}({chosenBrand?.brand}) {chosenDrugForm?.form} for upcoming interval</h3>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {renderQuantities(chosenDrugForm, prescribedDosagesQty)}
      </div>
    </div>
  );
};

export default PrescribedDosageQuantities;
