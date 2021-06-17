import * as React from 'react';
import {
  useRef, useContext, useCallback,
} from 'react';
import {
  add, differenceInCalendarDays,
  format, isAfter, isSameDay, sub,
} from 'date-fns';
import { Input, Select } from 'antd';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { css } from '@emotion/react';
import { PrescriptionFormContext } from './PrescriptionForm';
import { TaperConfigActions } from '../../redux/reducers/taperConfig';
import {
  IntervalActions,
  intervalCountChange, intervalEndDateChange,
  intervalStartDateChange, intervalUnitChange,
} from './actions';

const { Option } = Select;

const selectIntervalStyle = css`
  margin-top: 65px;
  width: 330px;

  & > h3 {
    font-size: 1rem;
    color: #636E72;
    margin-bottom: 22px;
  }

  & .select-interval-form {
    //font-size: 16px;
    font-size: 0.8rem;
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
    upcomingDosagesQty,
  } = useContext(PrescriptionFormContext);
  const dispatch = (action: IntervalActions) => {
    formActionDispatch(action);
    taperConfigActionDispatch(action);
  };

  const units = useRef(['Days', 'Weeks', 'Months']);

  const calcIntervalDurationDays = useCallback((startDate: Date, endDate: Date | null) => {
    return !endDate ? 0 : differenceInCalendarDays(endDate, startDate) + 1;
  }, []);

  const onIntervalStartDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    if (intervalEndDate && isAfter(date, intervalEndDate)) {
      alert('Interval start date must be before the interval end date.');
    } else {
      const intervalDurationDays = calcIntervalDurationDays(date, intervalEndDate);
      dispatch(intervalStartDateChange({
        date, id, intervalDurationDays,
      }));
    }
  }, [intervalEndDate, upcomingDosagesQty]);

  const onIntervalEndDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const tempEndDate = new Date(e.target.value);
    const newEndDate = new Date(tempEndDate.valueOf() + tempEndDate.getTimezoneOffset() * 60 * 1000);
    const intervalDurationDays = calcIntervalDurationDays(intervalStartDate, newEndDate);
    if (isSameDay(newEndDate, intervalStartDate) || isAfter(newEndDate, intervalStartDate)) {
      dispatch(intervalEndDateChange({
        date: newEndDate, id, intervalDurationDays,
      }));
    } else {
      alert('End date cannot be before the start date.');
      dispatch(intervalEndDateChange({
        date: null, id, intervalDurationDays,
      }));
    }
  }, [intervalStartDate, upcomingDosagesQty]);

  const onIntervalUnitChange = useCallback((value: 'Days' | 'Weeks' | 'Months') => {
    const endDate = sub(add(intervalStartDate, { [value.toLowerCase()]: intervalCount }), { days: 1 });
    const intervalDurationDays = calcIntervalDurationDays(intervalStartDate, endDate);

    dispatch(intervalUnitChange({
      unit: value, intervalEndDate: endDate, intervalDurationDays, id,
    }));
  }, [intervalStartDate, intervalCount, upcomingDosagesQty]);

  const onIntervalCountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value, 10);
    const endDate = count === 0 ? null : sub(add(intervalStartDate, { [intervalUnit.toLowerCase()]: count }),
      { days: 1 });
    const intervalDurationDays = calcIntervalDurationDays(intervalStartDate, endDate);

    dispatch(intervalCountChange({
      count: parseInt(e.target.value, 10), id, intervalEndDate: endDate, intervalDurationDays,
    }));
  }, [intervalStartDate, upcomingDosagesQty]);

  return (
    <div css={selectIntervalStyle}>
      <h3>Select Interval</h3>
      <div className='select-interval-form'>
        <label>Start on:</label>
        <Input
          type="date"
          value={format(intervalStartDate, 'yyyy-MM-dd')}
          onChange={onIntervalStartDateChange}
          css={css`width: 160px;
            height: 1.7rem;`}
        />
      </div>

      <div className='select-interval-form'>
        <label>Interval:</label>
        <div css={css`width: 180px;
          display: flex;
          justify-content: space-between;`}>
          <Input type="number" value={intervalCount} min={0} onChange={onIntervalCountChange} css={css`width: 70px;
            margin-right: 9px;
            height: 1.7rem;`}/>
          <Select value={intervalUnit} onChange={onIntervalUnitChange} css={css`
            width: 100px;

            & .ant-select-single .ant-select-selector {
              height: 1.7rem;
            }
          `}>
            {units.current.map((unit) => <Option key={unit} value={unit}>{unit}</Option>)}
          </Select>
        </div>
      </div>

      <div className='select-interval-form'>
        <label>End on</label>
        <Input
          type="date"
          value={intervalEndDate ? format(intervalEndDate, 'yyyy-MM-dd') : undefined}
          onChange={onIntervalEndDateChange}
          css={css`width: 160px;
            height: 1.7rem;`}
        />
      </div>
    </div>
  );
};

export default SelectInterval;
