import React, {
  forwardRef,
  useEffect,
  useImperativeHandle, useState,
} from 'react';
import { Input } from 'antd';

export default forwardRef((props, ref) => {
  const [date, setDate] = useState<Date|null>(null);
  useEffect(() => {
    // console.log('flatpickr: ', flatpickr);
    // setPicker(
    //   flatpickr((refFlatPickr.current as Node), {
    //     onChange: onDateChanged,
    //     dateFormat: 'd/m/Y',
    //     wrap: true,
    //   }),
    // );
  }, []);

  // useEffect(() => {
  // if (picker) {
  //   picker.calendarContainer.classList.add('ag-custom-component-popup');
  // }
  // }, [picker]);

  // useEffect(() => {
  // Callback after the state is set. This is where we tell ag-grid that the date has changed so
  // it will proceed with the filtering and we can then expect AG Grid to call us back to getDate
  // if (picker) {
  //   picker.setDate(date!);
  // }
  // }, [date, picker]);

  useImperativeHandle(ref, () => ({
    //* ********************************************************************************
    //          METHODS REQUIRED BY AG-GRID
    //* ********************************************************************************
    getDate() {
      // ag-grid will call us here when in need to check what the current date value is hold by this
      // component.
      return date;
    },

    setDate(date: Date) {
      // ag-grid will call us here when it needs this component to update the date that it holds.
      // setDate(date);
    },

  }));

  return (
    <>
      <Input type="date" style={{ width: '100%', height: '100%' }}/>
    </>
  );
});
