import * as React from 'react';
import {
  useRef, useContext,
} from 'react';
import {
  format, isAfter, isSameDay,
} from 'date-fns';
import { Input, Select } from 'antd';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { PrescriptionFormContext } from './PrescriptionForm';
import { TaperConfigActions } from '../../redux/reducers/taperConfig';
import {
  IntervalActions,
  intervalCountChange, intervalEndDateChange,
  intervalStartDateChange, intervalUnitChange,
} from './actions';

const { Option } = Select;

const inputStyle = {
  width: 200,
};

const SelectInterval = () => {
  const taperConfigActionDispatch = useDispatch<Dispatch<TaperConfigActions>>();
  const {
    formActionDispatch, intervalCount, intervalUnit,
    intervalStartDate, intervalEndDate, id,
  } = useContext(PrescriptionFormContext);
  const dispatch = (action: IntervalActions) => {
    formActionDispatch(action);
    taperConfigActionDispatch(action);
  };

  const units = useRef(['Days', 'Weeks', 'Months']);

  const onIntervalStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    if (intervalEndDate && isAfter(date, intervalEndDate)) {
      alert('Interval start date must be before the interval end date.');
    } else {
      dispatch(intervalStartDateChange(({ date, id })));
    }
  };

  const onIntervalEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tempEndDate = new Date(e.target.value);
    const newEndDate = new Date(tempEndDate.valueOf() + tempEndDate.getTimezoneOffset() * 60 * 1000);
    if (isSameDay(newEndDate, intervalStartDate) || isAfter(newEndDate, intervalStartDate)) {
      dispatch(intervalEndDateChange({ date: newEndDate, id }));
    } else {
      alert('End date cannot be before the start date.');
      dispatch(intervalEndDateChange({ date: null, id }));
    }
  };

  const onIntervalUnitChange = (value: 'Days' | 'Weeks' | 'Months') => {
    dispatch(intervalUnitChange({ unit: value, id }));
  };

  const onIntervalCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(intervalCountChange({ count: parseInt(e.target.value, 10), id }));
  };

  return (
    <>
      <h3>Select Interval</h3>
      <div>Start on</div>
      <Input
        type="date"
        value={format(intervalStartDate, 'yyyy-MM-dd')}
        onChange={onIntervalStartDateChange}
        style={inputStyle}
      />
      <div>Interval:</div>
      <Input type="number" value={intervalCount} min={0} onChange={onIntervalCountChange} style={inputStyle} />
      <Select value={intervalUnit} onChange={onIntervalUnitChange}>
        {units.current.map((unit) => <Option key={unit} value={unit}>{unit}</Option>)}
      </Select>

      <div>End on</div>
      <Input
        type="date"
        value={intervalEndDate ? format(intervalEndDate, 'yyyy-MM-dd') : undefined}
        onChange={onIntervalEndDateChange}
        style={inputStyle}
      />
    </>
  );
};

export default SelectInterval;
