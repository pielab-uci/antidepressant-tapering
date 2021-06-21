import React, {
  forwardRef, useEffect, useImperativeHandle, useState,
} from 'react';

import { format } from 'date-fns';
import Input from 'antd/es/input';

export default forwardRef((props: any, ref) => {
  const [date, setDate] = useState<Date | null>(null);
  useEffect(() => {
    console.group('DateEditor');
    console.log('props: ', props);
    console.log('ref: ', ref);
    console.groupEnd();
  }, []);
  const handleDateChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tempDate = new Date(e.target.value);
    const newDate = new Date(tempDate.valueOf() + tempDate.getTimezoneOffset() * 60 * 1000);

    setDate(newDate);
  };

  useImperativeHandle(
    ref, () => {
      return {
        getValue: () => {
          return date;
        },
        isCancelAfterEnd: () => {
          return !date;
        },
        afterGuiAttached: () => {
          if (!props.value) {
            return;
          }

          setDate(props.value);
        },
      };
    },
  );

  return (
    <>
      <Input type='date'
             style={{ width: '100%', height: '100%' }}
             value={date ? format(date, 'yyyy-MM-dd') : undefined} onChange={handleDateChanged}/>
    </>
  );
});
