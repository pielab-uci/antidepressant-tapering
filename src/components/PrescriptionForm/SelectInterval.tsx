import * as React from 'react';
import {
  useRef, useContext, useCallback,
} from 'react';
import add from 'date-fns/esm/add';
import differenceInCalendarDays from 'date-fns/esm/differenceInCalendarDays';
import format from 'date-fns/esm/format';
import isAfter from 'date-fns/esm/isAfter';
import isSameDay from 'date-fns/esm/isSameDay';
import sub from 'date-fns/esm/sub';

import Input from 'antd/es/input';
import Select from 'antd/es/select';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { css } from '@emotion/react';
import isBefore from 'date-fns/esm/isBefore';
import { PrescriptionFormContext } from './PrescriptionForm';
import { TaperConfigActions } from '../../redux/reducers/taperConfig';
import {
  IntervalActions,
  intervalCountChange, intervalEndDateChange, IntervalEndDateChangeData,
  intervalStartDateChange, IntervalStartDateChangeData, intervalUnitChange,
} from './actions';

const { Option } = Select;

const selectIntervalStyle = css`
  margin-top: 44px;
  width: 330px;

  & > h3 {
    font-size: 1rem;
    color: #636E72;
    margin-bottom: 22px;
  }

  & .select-interval-form {
    //font-size: 0.8rem;
    margin: 0 0 1rem 39px;
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 270px;
    justify-content: space-between;
  }

  & .select-interval-form > label {
    margin-right: 17px;
  }

  & .select-interval-form > input {
    width: 180px;
  }
`;

const SelectInterval = () => {
  const taperConfigActionDispatch = useDispatch<Dispatch<TaperConfigActions>>();
  const {
    formActionDispatch, intervalCount, intervalUnit,
    intervalStartDate, intervalEndDate, id,
    upcomingDosagesQty, modal: { isModal, modalDispatch },
  } = useContext(PrescriptionFormContext);
  const dispatch = (action: IntervalActions) => {
    if (isModal) {
      formActionDispatch(action);
      modalDispatch!(action);
    } else {
      formActionDispatch(action);
      taperConfigActionDispatch(action);
    }
  };

  const units = useRef(['Days', 'Weeks', 'Months']);

  const calcIntervalDurationDays = useCallback((startDate: Date, endDate: Date | null) => {
    return !endDate ? 0 : differenceInCalendarDays(endDate, startDate) + 1;
  }, []);

  const onIntervalStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const data = {} as IntervalStartDateChangeData;
    const date = new Date(e.target.value);
    data.intervalStartDate = new Date(date.valueOf() + date.getTimezoneOffset() * 60 * 1000);
    data.intervalEndDate = add(data.intervalStartDate, { [intervalUnit.toLowerCase()]: intervalCount });
    // if (intervalEndDate) {
    //   if (isAfter(data.intervalStartDate, intervalEndDate)) {
    //     data.intervalEndDate = add(data.intervalStartDate, { [intervalUnit.toLowerCase()]: intervalCount - 1 });
    //   } else {
    //     data.intervalUnit = 'Days';
    //     data.intervalDurationDays = differenceInCalendarDays(intervalEndDate, data.intervalStartDate) + 1;
    //     data.intervalCount = data.intervalDurationDays;
    //   }
    // }

    dispatch(intervalStartDateChange({
      ...data,
      id,
    }));
  };

  const onIntervalEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const data = {} as IntervalEndDateChangeData;
    const date = new Date(e.target.value);
    data.intervalEndDate = new Date(date.valueOf() + date.getTimezoneOffset() * 60 * 1000);

    if (isBefore(data.intervalEndDate, intervalStartDate)) {
      data.intervalStartDate = sub(data.intervalEndDate, { [intervalUnit.toLowerCase()]: intervalCount - 1 });
      // data.intervalStartDate = sub(data.intervalEndDate, { days: 1 });
      // data.intervalUnit = 'Days';
      // data.intervalCount = 1;
      // data.intervalDurationDays = 1;
    } else {
      data.intervalDurationDays = differenceInCalendarDays(data.intervalEndDate, intervalStartDate) + 1;
      data.intervalUnit = 'Days';
      data.intervalCount = data.intervalDurationDays;
    }

    dispatch(intervalEndDateChange({
      ...data,
      id,
    }));
  };

  const onIntervalUnitChange = (value: 'Days' | 'Weeks' | 'Months') => {
    const newIntervalCount = value === 'Days' ? 7 : 1;
    const endDate = sub(add(intervalStartDate, { [value.toLowerCase()]: newIntervalCount }), { days: 1 });
    const intervalDurationDays = calcIntervalDurationDays(intervalStartDate, endDate);

    dispatch(intervalUnitChange({
      unit: value, intervalEndDate: endDate, intervalDurationDays, intervalCount: newIntervalCount, id,
    }));
  };

  // const onIntervalUnitChange = useCallback((value: 'Days' | 'Weeks' | 'Months') => {
  //   const endDate = sub(add(intervalStartDate, { [value.toLowerCase()]: intervalCount }), { days: 1 });
  //   const intervalDurationDays = calcIntervalDurationDays(intervalStartDate, endDate);
  //
  //   dispatch(intervalUnitChange({
  //     unit: value, intervalEndDate: endDate, intervalDurationDays, id,
  //   }));
  // }, [intervalStartDate, intervalCount, upcomingDosagesQty]);

  const onIntervalCountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value, 10);
    const endDate = count === 0 || Number.isNaN(count) || count === null
      ? null
      : sub(
        add(intervalStartDate, { [intervalUnit.toLowerCase()]: count }),
        { days: 1 },
      );
    const intervalDurationDays = calcIntervalDurationDays(intervalStartDate, endDate);

    dispatch(intervalCountChange({
      count, id, intervalEndDate: endDate, intervalDurationDays,
    }));
  }, [intervalStartDate, intervalUnit, upcomingDosagesQty]);

  const onWheelEventHandler = (e: React.WheelEvent<HTMLInputElement>) => {
    e.currentTarget.blur();
  };

  return (
    <div css={selectIntervalStyle}>
      <h3>How often should the dosage change?</h3>
      <div className='select-interval-form'>
        <label>Start on:</label>
        <Input
          type="date"
          value={format(intervalStartDate, 'yyyy-MM-dd')}
          onChange={onIntervalStartDateChange}
          css={css`width: 160px;`}
        />
      </div>

      <div className='select-interval-form'>
        <label>Interval:</label>
        <div css={css`width: 180px;
          display: flex;
          justify-content: space-between;`}>
          <Input type="number" value={intervalCount} min={1}
                 onWheel={onWheelEventHandler}
                 onChange={onIntervalCountChange} css={css`width: 70px;
            margin-right: 9px;`}/>
          <Select value={intervalUnit} onChange={onIntervalUnitChange} css={css`
            width: 100px;

            & .ant-select-single .ant-select-selector {
              //height: 1.7rem;
            }
          `}>
            {units.current.map((unit) => <Option key={unit} value={unit}>{unit}</Option>)}
          </Select>
        </div>
      </div>

      <div className='select-interval-form'>
        <label>End on:</label>
        <Input
          type="date"
          value={intervalEndDate ? format(intervalEndDate, 'yyyy-MM-dd') : undefined}
          onChange={onIntervalEndDateChange}
          css={css`width: 160px;`}
        />
      </div>
    </div>
  );
};

export default SelectInterval;
