import * as React from 'react';
import {
  ChangeEvent,
  FC, useCallback,
} from 'react';
import { Input } from 'antd';
import { useDispatch } from 'react-redux';
import {
  Prescription, ValueOf,
} from '../../types';
import { finalPrescriptionQuantityChange } from '../../redux/actions/taperConfig';

interface Props {
  id: number,
  prescription: ValueOf<Prescription>;
}

const PrescribedQuantitiesForDrug: FC<Props> = ({ id, prescription }) => {
  const dispatch = useDispatch();
  const qtyOrZero = useCallback((dosages: typeof prescription['dosageQty'], dosage: string): number => {
    return dosages[dosage] ? dosages[dosage] : 0;
  }, []);

  const onPrescribedQuantityChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    dispatch(finalPrescriptionQuantityChange({
      id,
      dosage: e.target.title,
      quantity: parseFloat(e.target.value),
    }));
  }, []);

  const renderForms = useCallback((dosages: string[], prescription: ValueOf<Prescription>) => {
    return (
      <>
      <h4>{prescription.brand} {prescription.form}</h4>
        {dosages.map((dos: string) => (
          <div key={`${prescription.brand}_${prescription.form}_${dos}_final_prescription`}>
            <h5>{dos}</h5>
            <Input title={dos}
                   style={{ display: 'inline-block' }}
                   type='number'
                   min={0}
                   value={qtyOrZero(prescription.dosageQty, dos)}
                   step={0.5}
                   width={'50px'}
                   onChange={onPrescribedQuantityChange}/>
          </div>
        ))}
      </>
    );
  }, []);

  if (prescription.oralDosageInfo) {
    return renderForms(prescription.oralDosageInfo.bottles, prescription);
  }
  return renderForms(prescription.availableDosages, prescription);
};

export default PrescribedQuantitiesForDrug;
