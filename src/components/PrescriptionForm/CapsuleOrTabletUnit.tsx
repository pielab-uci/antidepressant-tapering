import * as React from 'react';
import {
  FC, useCallback, useContext,
} from 'react';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { css } from '@emotion/react';
import { PrescriptionFormContext } from './PrescriptionForm';
import { TaperConfigActions } from '../../redux/reducers/taperConfig';
import {
  priorDosageChange, PriorDosageChangeAction, upcomingDosageChange, UpcomingDosageChangeAction,
} from './actions';
import {
  ArrowDown, ArrowUp, CapsuleIcon, ScoredTabletIcon, UnscoredTabletIcon,
} from '../../assets/icons';

interface Props {
  form: string;
  time: 'Prior' | 'Upcoming'
  dosage: string;
  editable: boolean;
  isScored?: boolean;
}

const CapsuleOrTabletUnit: FC<Props> = ({
  time, form, dosage, isScored, editable,
}) => {
  const context = useContext(PrescriptionFormContext);
  const {
    formActionDispatch, id, intervalDurationDays, allowSplittingUnscoredTablet, modal: { isModal, modalDispatch },
  } = context;
  const { dosages } = context[time];
  const taperConfigActionDispatch = useDispatch<Dispatch<TaperConfigActions>>();
  const dispatch = (action: UpcomingDosageChangeAction | PriorDosageChangeAction) => {
    if (isModal) {
      formActionDispatch(action);
      modalDispatch!(action);
    } else {
      formActionDispatch(action);
      taperConfigActionDispatch(action);
    }
  };

  const quantity = (change: 'increment' | 'decrement', dosages: { [dosage: string]: number }, dosage: string) => {
    if (isScored) {
      return change === 'increment' ? dosages[dosage] + 0.5 : dosages[dosage] - 0.5;
    }
    return change === 'increment' ? dosages[dosage] + 1 : dosages[dosage] - 1;
  };

  const onIncrement = useCallback(() => {
    const actionData = {
      id,
      dosage: {
        dosage,
        quantity: quantity('increment', dosages, dosage),
      },
    };

    if (time === 'Upcoming') {
      dispatch(upcomingDosageChange(actionData));
    } else {
      dispatch(priorDosageChange(actionData));
    }
  }, [dosages, intervalDurationDays, allowSplittingUnscoredTablet]);

  const onDecrement = useCallback(() => {
    const actionData = {
      id,
      dosage: {
        dosage,
        quantity: quantity('decrement', dosages, dosage),
      },
    };

    if (time === 'Upcoming') {
      dispatch(upcomingDosageChange(actionData));
    } else {
      dispatch(priorDosageChange(actionData));
    }
  }, [dosages, intervalDurationDays, allowSplittingUnscoredTablet]);

  const renderIcon = () => {
    const wrapperStyle = css`
      display: flex;
      margin-left: 5px;`;
    if (form === 'tablet') {
      return (
        <div css={wrapperStyle}>
          {isScored
            ? <ScoredTabletIcon value={dosages[dosage]}/>
            : <UnscoredTabletIcon value={dosages[dosage]}/>}
        </div>
      );
    }
    return <div css={wrapperStyle}>
      <CapsuleIcon value={dosages[dosage]}/>
    </div>;
  };
  return (
    <div css={css`display: flex;
      flex-direction: column;
      align-items: flex-end;`}>
      <div css={css`display: flex;
        margin-bottom: 5px;`}>
        <div className='dosage-arrow-button' css={css`display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;

          & button {
            border: none;
            background-color: white;
            padding: 5px 5px;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
          }`}>
          <div>
            <button onClick={editable ? onIncrement : () => {}}>
              <ArrowUp/>
            </button>
          </div>
          <div>
            <button onClick={editable ? onDecrement : () => {}}>
              <ArrowDown/>
            </button>
          </div>
        </div>
        {renderIcon()}
      </div>
      <div css={css`margin-right: 10px;`}>{dosage}</div>
    </div>
  );
};

export default CapsuleOrTabletUnit;
