import * as React from 'react';
import {
  useRef, useContext, useCallback,
} from 'react';
import {
  add,
  differenceInCalendarDays,
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

const { Option } = Select;

const inputStyle = {
  width: 200,
};

const SelectInterval = () => {
  const taperConfigActionDispatch = useDispatch<Dispatch<TaperConfigActions>>();
  const {
    formActionDispatch, intervalCount, intervalUnit,
    intervalStartDate, intervalEndDate, id, prescribedDosagesQty, chosenDrugForm,
    upcomingDosagesQty,
  } = useContext(PrescriptionFormContext);
  const dispatch = (action: IntervalActions) => {
    formActionDispatch(action);
    taperConfigActionDispatch(action);
  };

  const units = useRef(['Days', 'Weeks', 'Months']);

  const calcIntervalDurationDays = useCallback((startDate: Date, endDate: Date|null) => {
    return !endDate ? 0 : differenceInCalendarDays(endDate, startDate) + 1;
  }, []);

  const calcPrescribedDosageQty = (intervalStartDate: Date, intervalEndDate: Date|null, intervalDurationDays: number, upcomingDosageQty: { [dosage: string]: number }) => {
    return Object.entries(upcomingDosageQty).reduce((prev: { [p: string]:number }, [dosage, qty]) => {
      prev[dosage] = qty * intervalDurationDays;
      return prev;
    }, {});
  };

  const onIntervalStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    if (intervalEndDate && isAfter(date, intervalEndDate)) {
      alert('Interval start date must be before the interval end date.');
    } else {
      // dispatch(intervalStartDateChange(({ date, id })));
      const intervalDurationDays = calcIntervalDurationDays(date, intervalEndDate);
      const prescribedDosages = calcPrescribedDosageQty(date, intervalEndDate, intervalDurationDays, upcomingDosagesQty);
      // formActionDispatch(intervalStartDateChange({
      //   date, id, prescribedDosages, intervalDurationDays,
      // }));
      // taperConfigActionDispatch(intervalStartDateChange({
      //   date, id, prescribedDosages, intervalDurationDays,
      // }));
      dispatch(intervalStartDateChange({
        date, id, prescribedDosages, intervalDurationDays,
      }));
    }
  };

  const onIntervalEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tempEndDate = new Date(e.target.value);
    const newEndDate = new Date(tempEndDate.valueOf() + tempEndDate.getTimezoneOffset() * 60 * 1000);
    const intervalDurationDays = calcIntervalDurationDays(intervalStartDate, newEndDate);
    const prescribedDosages = calcPrescribedDosageQty(newEndDate, intervalEndDate, intervalDurationDays, upcomingDosagesQty);
    if (isSameDay(newEndDate, intervalStartDate) || isAfter(newEndDate, intervalStartDate)) {
      // dispatch(intervalEndDateChange({ date: newEndDate, id }));
      // formActionDispatch(intervalEndDateChange({
      //   date: newEndDate, id, prescribedDosages, intervalDurationDays,
      // }));
      // taperConfigActionDispatch(intervalEndDateChange({
      //   date: newEndDate, id, prescribedDosages, intervalDurationDays,
      // }));
      dispatch(intervalEndDateChange({
        date: newEndDate, id, prescribedDosages, intervalDurationDays,
      }));
    } else {
      alert('End date cannot be before the start date.');
      dispatch(intervalEndDateChange({
        date: null, id, intervalDurationDays, prescribedDosages,
      }));
    }
  };

  const onIntervalUnitChange = (value: 'Days' | 'Weeks' | 'Months') => {
    // dispatch(intervalUnitChange({ unit: value, id }));
    const endDate = sub(add(intervalStartDate, { [value.toLowerCase()]: intervalCount }), { days: 1 });
    const intervalDurationDays = calcIntervalDurationDays(intervalStartDate, endDate);
    const prescribedDosages = calcPrescribedDosageQty(intervalStartDate, endDate, intervalDurationDays, upcomingDosagesQty);

    dispatch(intervalUnitChange({
      unit: value, intervalEndDate: endDate, intervalDurationDays, prescribedDosages, id,
    }));
  };

  const onIntervalCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // dispatch(intervalCountChange({ count: parseInt(e.target.value, 10), id }));
    // if (intervalEndDate) {
    const count = parseInt(e.target.value, 10);
    const endDate = count === 0 ? null : sub(add(intervalStartDate, { [intervalUnit.toLowerCase()]: count }),
      { days: 1 });
    const intervalDurationDays = calcIntervalDurationDays(intervalStartDate, endDate);
    const prescribedDosages = calcPrescribedDosageQty(
      intervalStartDate,
      endDate,
      intervalDurationDays,
      upcomingDosagesQty,
    );

    dispatch(intervalCountChange({
      count: parseInt(e.target.value, 10), id, intervalEndDate: endDate, intervalDurationDays, prescribedDosages,
    }));
    // }
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
