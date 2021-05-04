import * as React from 'react';
import { useRef, useContext, useCallback } from 'react';
import { format, isAfter } from 'date-fns';
import { Input, Select } from 'antd';
import { PrescriptionFormContext } from './PrescriptionForm/PrescriptionForm';
import {
  intervalCountChange,
  intervalEndDateChange,
  intervalStartDateChange,
  intervalUnitChange,
} from './PrescriptionForm/actions';

const { Option } = Select;

const inputStyle = {
  width: 200,
};

const SelectInterval = () => {
  const {
    intervalCount,
    intervalUnit,
    intervalStartDate,
    intervalEndDate,
    dispatch,
    id,
  } = useContext(PrescriptionFormContext);
  const units = useRef(['Days', 'Weeks', 'Months']);
  const onIntervalStartDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(intervalStartDateChange({ id, date: new Date(e.target.value) }));
  }, []);

  const onIntervalEndDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isAfter(new Date(e.target.value), intervalStartDate)) {
      alert('End date must be after the start date.');
      dispatch(intervalEndDateChange({ id, date: null }));
    } else {
      dispatch(intervalEndDateChange({ id, date: new Date(e.target.value) }));
    }
  }, [intervalStartDate]);

  const onIntervalUnitChange = useCallback((value: 'Days' | 'Weeks' | 'Months') => {
    dispatch(intervalUnitChange({ id, unit: value }));
  }, []);

  const onIntervalCountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(intervalCountChange({ id, count: parseInt(e.target.value, 10) }));
  }, []);

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
