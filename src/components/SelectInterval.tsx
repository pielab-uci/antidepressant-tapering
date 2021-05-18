import * as React from 'react';
import {
  useRef, useContext,
} from 'react';
import { format, isAfter } from 'date-fns';
import { Input, Select } from 'antd';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { PrescriptionFormContext } from './PrescriptionForm/PrescriptionForm';
import { TaperConfigActions } from '../redux/reducers/taperConfig';
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
  const taperConfigActionDispatch = useDispatch<Dispatch<TaperConfigActions>>();
  const {
    formActionDispatch, intervalCount, intervalUnit,
    intervalStartDate, intervalEndDate, id,
  } = useContext(PrescriptionFormContext);
  const units = useRef(['Days', 'Weeks', 'Months']);

  const onIntervalStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('SelectInterval.onIntervalStartDateChange');
    formActionDispatch(intervalStartDateChange(({ date: new Date(e.target.value), id })));
    taperConfigActionDispatch(intervalStartDateChange({ date: new Date(e.target.value), id }));
  };

  const onIntervalEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('SelectInterval.onIntervalEndDateChange');
    if (!isAfter(new Date(e.target.value), intervalStartDate)) {
      alert('End date must be after the start date.');
      formActionDispatch(intervalEndDateChange({ date: null, id }));
      taperConfigActionDispatch(intervalEndDateChange({ date: null, id }));
    } else {
      formActionDispatch(intervalEndDateChange({ date: new Date(e.target.value), id }));
      taperConfigActionDispatch(intervalEndDateChange({ date: new Date(e.target.value), id }));
    }
  };

  const onIntervalUnitChange = (value: 'Days' | 'Weeks' | 'Months') => {
    console.log('SelectInterval.onIntervalUnitChange');
    formActionDispatch(intervalUnitChange({ unit: value, id }));
    taperConfigActionDispatch(intervalUnitChange({ unit: value, id }));
  };

  const onIntervalCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('SelectInterval.onIntervalCountChange');
    formActionDispatch(intervalCountChange({ count: parseInt(e.target.value, 10), id }));
    taperConfigActionDispatch(intervalCountChange({ count: parseInt(e.target.value, 10), id }));
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
        value={intervalEndDate ? format(new Date(intervalEndDate.valueOf() + intervalEndDate.getTimezoneOffset() * 60 * 1000), 'yyyy-MM-dd') : undefined}
        onChange={onIntervalEndDateChange}
        style={inputStyle}
      />
    </>
  );
};

export default SelectInterval;
