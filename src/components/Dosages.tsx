import * as React from 'react';
import {
  FC, useCallback, useContext, useEffect, useState,
} from 'react';
import { Checkbox } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { useDispatch } from 'react-redux';
import DrugUnit from './DrugUnit';
import { PrescriptionFormContext } from './PrescriptionForm/PrescriptionForm';

interface Props {
  time: 'Current' | 'Next';
  dosages: { [key: string]: number }
}

const Dosages: FC<Props> = ({ time, dosages }) => {
  const context = useContext(PrescriptionFormContext);
  const {
    chosenDrugForm, dosageOptions, currentDosagesQty, nextDosagesQty, id,
    formActionDispatch,
  } = context;
  const taperConfigActionDispatch = useDispatch();
  const { allowSplittingUnscored, toggleAllowSplittingUnscored } = context[time];
  const unit = Object.keys(dosages)[0].match(/[a-z]+/); // TODO: need to check
  const [dosageDifferencePercent, setDosageDifferencePercent] = useState<string | null>(null);
  const calculateDosageSum = (dosages: { [key: string]: number }): number => Object
    .entries(dosages)
    .reduce((acc, [dosage, count]) => acc + parseFloat(dosage) * count, 0);

  useEffect(() => {
    if (time === 'Next') {
      const currentDosageSum = calculateDosageSum(currentDosagesQty);
      const nextDosageSum = calculateDosageSum(nextDosagesQty);
      if (currentDosageSum === 0) {
        setDosageDifferencePercent(null);
      } else {
        setDosageDifferencePercent(
          ((nextDosageSum - currentDosageSum) / currentDosageSum * 100).toFixed(2),
        );
      }
    }
  }, [currentDosagesQty, nextDosagesQty]);

  const toggleAllowSplittingUnscoredCheckbox = (e: CheckboxChangeEvent) => {
    formActionDispatch(toggleAllowSplittingUnscored({ id, allow: e.target.checked }));
    taperConfigActionDispatch(toggleAllowSplittingUnscored({ id, allow: e.target.checked }));
  };

  return (
    <>
      <div>
        {time}
        {' '}
        Dosage
      </div>
      <div style={{ display: 'flex' }}>
        {dosageOptions.map((v) => (
          <DrugUnit
            key={`${time}_${chosenDrugForm!.form}_${v}`}
            time={time}
            form={chosenDrugForm!.form}
            dosage={v}
          />
        ))}
      </div>
      <Checkbox checked={allowSplittingUnscored} onChange={toggleAllowSplittingUnscoredCheckbox}>Allow for splitting unscored tablets.</Checkbox>
      {time === 'Next' && dosageDifferencePercent
      && (
      <div style={{ color: 'red' }}>
        {dosageDifferencePercent}
        % change
      </div>
      )}
      <div>
        Total:
        {calculateDosageSum(dosages)}
        {' '}
        {unit}
      </div>
    </>
  );
};

export default Dosages;
