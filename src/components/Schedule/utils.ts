import { ValueSetterParams } from 'ag-grid-community';

const validator = (newValue: number, validateFn: Function, onSuccess: Function, _onFail: Function) => {
  if (validateFn(newValue)) {
    onSuccess();
  } else {
    _onFail();
  }
};

const _onSuccess = (params: ValueSetterParams) => () => {
  const { data } = params;
  const { field } = params.colDef;

  data[field!] = {
    ...data[field!],
    value: params.newValue,
  };

  params.api!.applyTransaction({ update: [data] });
};

const _onFail = (params: ValueSetterParams) => () => {
  const { data } = params;
  const { field } = params.colDef;

  data[field!] = {
    ...data[field!],
    value: params.oldValue,
  };
  // params.api!.applyTransaction({ update: [data] });
};

export const valueSetter = (validateFn: Function) => (params:ValueSetterParams) => {
  validator(params.newValue, validateFn, _onSuccess(params), _onFail(params));
  return false;
};
