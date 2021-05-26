import * as React from 'react';
import {
  FC,
  useCallback,
} from 'react';
import { Input } from 'antd';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { prescribedQuantityChange } from './PrescriptionForm/actions';
import { TaperConfigActions } from '../redux/reducers/taperConfig';
import { isCapsuleOrTablet, PrescribedDrug } from '../types';

interface Props {
  prescribedDrug: PrescribedDrug;
}
const PrescribedDosageQuantities: FC<Props> = ({ prescribedDrug }) => {
  const taperConfigActionDispatch = useDispatch<Dispatch<TaperConfigActions>>();

  const onCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const actionData = {
      dosage: { dosage: e.target.title, quantity: parseFloat(e.target.value) },
      id: prescribedDrug.id,
    };

    // formActionDispatch(prescribedQuantityChange(actionData));
    // TODO: add intervalDurationDays to PrescribedDrug
    taperConfigActionDispatch(prescribedQuantityChange({ ...actionData, intervalDurationDays: prescribedDrug.intervalDurationDays }));
  };

  const qtyOrZero = useCallback((prescribedDrug: PrescribedDrug, dosage: string): number => {
    return prescribedDrug.prescribedDosages[dosage]
      ? prescribedDrug.prescribedDosages[dosage] * prescribedDrug.intervalDurationDays
      : 0;
  }, []);

  const renderQuantities = useCallback(() => {
    if (isCapsuleOrTablet(prescribedDrug)) {
      return (
          <>
            {prescribedDrug.regularDosageOptions!.map((dosage) => (
              <div key={`${prescribedDrug.id}_${dosage}_${prescribedDrug.prescribedDosages[dosage]}`}>
                <h4>{dosage}:</h4>
                <Input
                  title={dosage}
                  style={{ display: 'inline-block' }}
                  type="number"
                  min={0}
                  defaultValue={qtyOrZero(prescribedDrug, dosage)}
                  value={prescribedDrug.prescribedDosages[dosage]}
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
          {prescribedDrug.availableDosageOptions.map((bottle) => (
            <div key={`${prescribedDrug.id}_${bottle}`}>
              <h4>{bottle}:</h4>
              <Input title={bottle}
                     style={{ display: 'inline-block' }}
                     type="number"
                     min={0}
                     defaultValue={qtyOrZero(prescribedDrug, bottle)}
                     value={prescribedDrug.prescribedDosages[bottle]}
                     step={1}
                     width={'50px'}
                     onChange={onCountChange}/>
            </div>
          ))}
        </>
    );
  }, [prescribedDrug]);

  return (
    <div>
      <h3>{prescribedDrug.name} ({prescribedDrug.brand}) {prescribedDrug.form}</h3>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {renderQuantities()}
      </div>
    </div>
  );
};

export default PrescribedDosageQuantities;
