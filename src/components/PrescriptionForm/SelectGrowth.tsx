import * as React from 'react';
import { useContext } from 'react';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import Radio, { RadioChangeEvent } from 'antd/es/radio';
import { css } from '@emotion/react';
import { TaperConfigActions } from '../../redux/reducers/taperConfig';
import { PrescriptionFormContext } from './PrescriptionForm';
import { SET_GROWTH, SetGrowthAction } from './actions';

const SelectGrowth = () => {
  const {
    formActionDispatch, growth, modal: { isModal, modalDispatch }, id,
  } = useContext(PrescriptionFormContext);
  const taperConfigActionDispatch = useDispatch<Dispatch<TaperConfigActions>>();
  const dispatch = (action: SetGrowthAction) => {
    if (isModal) {
      formActionDispatch(action);
      modalDispatch!(action);
    } else {
      formActionDispatch(action);
      taperConfigActionDispatch(action);
    }
  };

  const onChangeRadio = (e: RadioChangeEvent) => {
    dispatch({
      type: SET_GROWTH,
      data: { id, growth: e.target.value },
    });
  };

  return (
    <div css={css`display: flex; flex-direction: column; margin-top: 44px;`}>
      <h3 css={css`color: #636E72; font-size: 1rem;`}>Projection of taper schedule</h3>
      <Radio.Group onChange={onChangeRadio} value={growth} css={css`display: flex; color: #636E72; margin-left: 64px;`}>
        <Radio value={'linear'}>Linear</Radio>
        <Radio value={'exponential'}>Exponential</Radio>
      </Radio.Group>
    </div>
  );
};

export default SelectGrowth;
