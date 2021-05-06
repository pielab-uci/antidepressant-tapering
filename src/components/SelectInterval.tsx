import * as React from 'react';
import {
  useRef, useContext, useCallback, useEffect,
} from 'react';
import { format, isAfter } from 'date-fns';
import { Input, Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { PrescriptionFormContext } from './PrescriptionForm/PrescriptionForm';
import {
  intervalCountChange,
  intervalEndDateChange,
  intervalStartDateChange,
  intervalUnitChange,
} from '../redux/actions/taperConfig';
import { RootState } from '../redux/reducers';
import { TaperConfigActions, TaperConfigState } from '../redux/reducers/taperConfig';
import { intervalDurationDaysChange } from './PrescriptionForm/actions';

const { Option } = Select;

const inputStyle = {
  width: 200,
};

const SelectInterval = () => {
  const taperConfigActionDispatch = useDispatch<Dispatch<TaperConfigActions>>();
  const { formActionDispatch } = useContext(PrescriptionFormContext);
  const {
    intervalCount, intervalUnit,
    intervalStartDate, intervalEndDate,
    intervalDurationDays,
  } = useSelector<RootState, TaperConfigState>((state) => state.taperConfig);
  const units = useRef(['Days', 'Weeks', 'Months']);

  useEffect(() => {
    formActionDispatch(intervalDurationDaysChange(intervalDurationDays));
  }, [intervalDurationDays]);

  const onIntervalStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('SelectInterval.onIntervalStartDateChange');
    taperConfigActionDispatch(intervalStartDateChange({ date: new Date(e.target.value) }));
  };

  const onIntervalEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('SelectInterval.onIntervalEndDateChange');
    if (!isAfter(new Date(e.target.value), intervalStartDate)) {
      alert('End date must be after the start date.');
      taperConfigActionDispatch(intervalEndDateChange({ date: null }));
    } else {
      taperConfigActionDispatch(intervalEndDateChange({ date: new Date(e.target.value) }));
    }
  };

  const onIntervalUnitChange = (value: 'Days' | 'Weeks' | 'Months') => {
    console.log('SelectInterval.onIntervalUnitChange');
    taperConfigActionDispatch(intervalUnitChange({ unit: value }));
  };

  const onIntervalCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('SelectInterval.onIntervalCountChange');
    taperConfigActionDispatch(intervalCountChange({ count: parseInt(e.target.value, 10) }));
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
