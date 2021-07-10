import * as React from 'react';
import {
  ChangeEvent,
  FC, useCallback, useRef,
} from 'react';
import Input from 'antd/es/input';
import { useDispatch } from 'react-redux';
import { css } from '@emotion/react';
import {
  Prescription, ValueOf,
} from '../../types';
import { finalPrescriptionQuantityChange } from '../../redux/actions/taperConfig';

interface Props {
  id: number,
  prescription: ValueOf<Prescription>;
  editable: boolean;
}

const PrescribedQuantitiesForDrug: FC<Props> = ({ id, prescription, editable }) => {
  const dispatch = useDispatch();
  const initialPrescription = useRef<ValueOf<Prescription>>(prescription);
  const qtyOrZero = useCallback((dosages: typeof prescription['dosageQty'], dosage: string): number => {
    return dosages[dosage] ? Math.round(dosages[dosage]) : 0;
  }, []);

  const onPrescribedQuantityChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    dispatch(finalPrescriptionQuantityChange({
      id,
      dosage: e.target.title,
      quantity: parseFloat(e.target.value),
    }));
  }, []);

  const onWheelEventHandler = (e: React.WheelEvent<HTMLInputElement>) => {
    e.currentTarget.blur();
  };

  const renderForms = useCallback((dosages: string[], prescription: ValueOf<Prescription>) => {
    return (
      <>
        <div>{prescription.brand} {prescription.form}</div>
        <div>

          <div css={css`margin-top: 10px;`}>
            {dosages.map((dos: string) => (
              <div key={`${prescription.brand}_${prescription.form}_${dos}_final_prescription`}
                   css={css`
                     display: flex;
                     align-items: center;
                     margin: 0 0 24px 39px;
                   `}>
                <div>{dos}:</div>
                <Input title={dos}
                       css={css`
                         margin-left: 14px;
                         width: 60px;`}
                       type='number'
                       min={0}
                       value={qtyOrZero(prescription.dosageQty, dos)}
                       step={1}
                       width={'50px'}
                       readOnly={!editable}
                       onWheel={onWheelEventHandler}
                       onChange={onPrescribedQuantityChange}/>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }, []);

  if (prescription.oralDosageInfo) {
    return renderForms(prescription.oralDosageInfo.bottles, prescription);
  }
  // return renderForms(prescription.availableDosages, prescription);
  return renderForms(prescription.regularDosageOptions, prescription);
};

export default PrescribedQuantitiesForDrug;
