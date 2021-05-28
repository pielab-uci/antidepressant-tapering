import * as React from 'react';
import {
  useRef, useContext, useCallback,
} from 'react';
import {
  add,
  format, isAfter, isSameDay, sub,
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
import { calcIntervalDurationDays, calcPrescribedDosageQty } from '../utils';

const { Option } = Select;

const inputStyle = {
  width: 200,
};

const SelectInterval = () => {
  const taperConfigActionDispatch = useDispatch<Dispatch<TaperConfigActions>>();
  const {
    formActionDispatch, intervalCount, intervalUnit,
    intervalStartDate, intervalEndDate, id,
    upcomingDosagesQty, chosenDrugForm,
    oralDosageInfo,
  } = useContext(PrescriptionFormContext);
  const dispatch = (action: IntervalActions) => {
    formActionDispatch(action);
    taperConfigActionDispatch(action);
  };

  const units = useRef(['Days', 'Weeks', 'Months']);

  const onIntervalStartDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    if (intervalEndDate && isAfter(date, intervalEndDate)) {
      alert('Interval start date must be before the interval end date.');
    } else {
      const intervalDurationDays = calcIntervalDurationDays(date, intervalEndDate);
      const prescribedDosages = calcPrescribedDosageQty({
        chosenDrugForm, intervalDurationDays, upcomingDosagesQty, oralDosageInfo,
      });
      dispatch(intervalStartDateChange({
        date, id, prescribedDosages, intervalDurationDays,
      }));
    }
  }, [intervalEndDate, upcomingDosagesQty]);

  const onIntervalEndDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const tempEndDate = new Date(e.target.value);
    const newEndDate = new Date(tempEndDate.valueOf() + tempEndDate.getTimezoneOffset() * 60 * 1000);
    const intervalDurationDays = calcIntervalDurationDays(intervalStartDate, newEndDate);
    const prescribedDosages = calcPrescribedDosageQty({
      chosenDrugForm, intervalDurationDays, upcomingDosagesQty, oralDosageInfo,
    });
    if (isSameDay(newEndDate, intervalStartDate) || isAfter(newEndDate, intervalStartDate)) {
      dispatch(intervalEndDateChange({
        date: newEndDate, id, prescribedDosages, intervalDurationDays,
      }));
    } else {
      alert('End date cannot be before the start date.');
      dispatch(intervalEndDateChange({
        date: null, id, intervalDurationDays, prescribedDosages,
      }));
    }
  }, [intervalStartDate, upcomingDosagesQty]);

  const onIntervalUnitChange = useCallback((value: 'Days' | 'Weeks' | 'Months') => {
    const endDate = sub(add(intervalStartDate, { [value.toLowerCase()]: intervalCount }), { days: 1 });
    const intervalDurationDays = calcIntervalDurationDays(intervalStartDate, endDate);
    const prescribedDosages = calcPrescribedDosageQty({
      chosenDrugForm, intervalDurationDays, upcomingDosagesQty, oralDosageInfo,
    });

    dispatch(intervalUnitChange({
      unit: value, intervalEndDate: endDate, intervalDurationDays, prescribedDosages, id,
    }));
  }, [intervalStartDate, intervalCount, upcomingDosagesQty]);

  const onIntervalCountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value, 10);
    const endDate = count === 0 ? null : sub(add(intervalStartDate, { [intervalUnit.toLowerCase()]: count }),
      { days: 1 });
    const intervalDurationDays = calcIntervalDurationDays(intervalStartDate, endDate);
    const prescribedDosages = calcPrescribedDosageQty({
      chosenDrugForm,
      intervalDurationDays,
      upcomingDosagesQty,
      oralDosageInfo,
    });

    dispatch(intervalCountChange({
      count: parseInt(e.target.value, 10), id, intervalEndDate: endDate, intervalDurationDays, prescribedDosages,
    }));
  }, [intervalStartDate, upcomingDosagesQty]);

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
