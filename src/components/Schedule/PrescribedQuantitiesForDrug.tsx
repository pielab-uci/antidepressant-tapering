import * as React from 'react';
import {
  FC, useCallback,
} from 'react';
import { Input } from 'antd';
import {
  Prescription, ValueOf,
} from '../../types';

interface Props {
  prescription: ValueOf<Prescription>;
}

const PrescribedQuantitiesForDrug: FC<Props> = ({ prescription }) => {
  const qtyOrZero = useCallback((dosages: typeof prescription['dosageQty'], dosage: string): number => {
    return dosages[dosage] ? dosages[dosage] : 0;
  }, []);

  const renderForms = useCallback((dosages: string[], prescription: ValueOf<Prescription>) => {
    return (
      <>
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
                   readOnly/>
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
