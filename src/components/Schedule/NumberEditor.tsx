import * as React from 'react';
import { forwardRef, useImperativeHandle, useState } from 'react';
import Input from 'antd/es/input';

export default forwardRef((props: any, ref) => {
  const [value, setValue] = useState<number|null>(null);
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(parseFloat(e.target.value));
  };

  useImperativeHandle(
    ref,
    () => {
      return {
        getValue: () => value,
        isCancelAfterEnd: () => !value,
        afterGuiAttached: () => {
          if (!props.value) {
            return;
          }
          setValue(props.value);
        },
      };
    },
  );

  return (
    <>
    <Input type='number'
           style={{ width: '100%', height: '100%' }}
           value={value || undefined}
           min={0}
           onChange={handleValueChange}
    />
    </>
  );
});
