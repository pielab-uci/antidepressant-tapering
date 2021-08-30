import * as React from 'react';
import {
  FC, useCallback, useContext, useRef, useState,
} from 'react';
import Input from 'antd/es/input';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { css } from '@emotion/react';
import { PrescriptionFormContext } from './PrescriptionForm';
import { TaperConfigActions } from '../../redux/reducers/taperConfig';
import { OralDosage } from '../../types';
import useDosageSumDifferenceMessage from '../../hooks/useDosageSumDifferenceMessage';
import {
  currentDosageChange, CurrentDosageChangeAction, nextDosageChange, NextDosageChangeAction,
} from './actions';
import SelectGrowth from './SelectGrowth';

interface Props {
  time: 'Current' | 'Next';
  editable: boolean;
}

const inputStyle = {
  width: 150,
};

const OralFormDosage: FC<Props> = ({ time, editable }) => {
  const context = useContext(PrescriptionFormContext);
  const taperConfigActionDispatch = useDispatch<Dispatch<TaperConfigActions>>();
  const {
    formActionDispatch, id, chosenDrugForm, nextDosagesQty,
    currentDosageSum, nextDosageSum, growth, currentOralDosageInfo, nextOralDosageInfo,
    intervalDurationDays, modal: { isModal, modalDispatch },
  } = context;
  const { dosages } = context[time];
  const dosage = useRef('1mg');
  const oralDosageInfo = useRef<OralDosage>(time === 'Current' ? currentOralDosageInfo! : nextOralDosageInfo!);
  console.log('time: ', time, 'currentOralDosageInfo: ', currentOralDosageInfo, 'nextOralDosageInfo: ', nextOralDosageInfo, 'oralDosageInfo: ', oralDosageInfo);
  const [mlDosage, setmlDosage] = useState<number | undefined>((dosages['1mg'] / oralDosageInfo!.current.rate.mg) * oralDosageInfo!.current.rate.ml);
  // const [mlDosage, setmlDosage] = useState<number | undefined>((dosages['1mg'] / oralDosageInfo!.rate.mg) * oralDosageInfo!.rate.ml);
  const [mgDosage, setmgDosage] = useState<number | undefined>(dosages['1mg']);

  const dosageDifferenceMessage = useDosageSumDifferenceMessage(time, currentDosageSum, nextDosageSum, growth);
  const dispatch = (action: NextDosageChangeAction | CurrentDosageChangeAction) => {
    if (isModal) {
      formActionDispatch(action);
      modalDispatch!(action);
    } else {
      formActionDispatch(action);
      taperConfigActionDispatch(action);
    }
  };

  const mgOnChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { rate } = chosenDrugForm!.dosages as OralDosage;
    const mg = parseInt(e.target.value, 10);

    if (Number.isNaN(mg)) {
      setmlDosage(undefined);
      setmgDosage(undefined);
    } else {
      setmgDosage(mg);
      const ml = (mg / rate.mg) * rate.ml;
      setmlDosage(ml);
    }

    const actionData: NextDosageChangeAction['data'] | CurrentDosageChangeAction['data'] = {
      id,
      dosage: { dosage: dosage.current, quantity: Number.isNaN(mg) ? 0 : mg },
    };

    if (actionData.dosage.quantity >= 0) {
      if (time === 'Next') {
        dispatch(nextDosageChange(actionData));
      } else {
        dispatch(currentDosageChange(actionData));
      }
    }
  }, [chosenDrugForm, intervalDurationDays, currentDosageSum, nextDosageSum, oralDosageInfo, currentOralDosageInfo, nextOralDosageInfo]);

  const mlOnChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const ml = parseInt(e.target.value, 10);
    const { rate } = chosenDrugForm!.dosages as OralDosage;
    const mg = Number.isNaN(ml) ? undefined : (ml / rate.ml) * rate.mg;

    if (Number.isNaN(ml)) {
      setmlDosage(undefined);
      setmgDosage(undefined);
    } else {
      setmlDosage(ml);
      setmgDosage(mg);
    }

    const actionData: NextDosageChangeAction['data'] | CurrentDosageChangeAction['data'] = {
      id,
      dosage: { dosage: dosage.current, quantity: mg === undefined ? 0 : mg },
    };

    if (actionData.dosage.quantity >= 0) {
      if (time === 'Next') {
        dispatch(nextDosageChange(actionData));
      } else {
        dispatch(currentDosageChange(actionData));
      }
    }
  }, [chosenDrugForm, intervalDurationDays, currentDosageSum, nextDosageSum, oralDosageInfo, currentOralDosageInfo, nextOralDosageInfo]);

  return (
    <>
      <h3 css={css`font-size: 1rem;
        color: #636E72;`}>
        {time} Dosage
      </h3>
      <div css={css`display: flex;
        flex-direction: column;`}>
        <div css={css`display: flex;`}>
          <div css={css`
            display: flex;
            width: 550px;
            height: 50px;
            align-items: center;
            justify-content: space-between;
            margin-left: 64px;`}>
            <div>
              <Input type='number'
                // value={dosages['1mg']}
                     value={mgDosage}
                     onChange={mgOnChange}
                     readOnly={!editable}
                     min={0}
                     style={inputStyle}/> mg =
              <Input type='number'
                     value={mlDosage}
                     onChange={mlOnChange}
                     readOnly={!editable}
                     min={0}
                     style={inputStyle}/> ml
            </div>
          </div>
          <div css={css`
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: center;
            margin-left: 20px;`}>
            {time === 'Next' && dosageDifferenceMessage && mgDosage !== undefined
            && (
              <div css={css`color: #0984E3;`}>
                {dosageDifferenceMessage}
              </div>
            )}
            <div>
              Total:
              {time === 'Next' ? nextDosageSum : currentDosageSum}
              {' '}
              {chosenDrugForm!.measureUnit}
            </div>
          </div>
        </div>
      </div>
      {time === 'Next' && <SelectGrowth/>}
    </>
  );
};

export default OralFormDosage;
