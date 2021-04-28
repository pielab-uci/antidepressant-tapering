import * as React from 'react';
import {FC, RefObject} from "react";
import {useForm} from "react-hook-form";
interface Props {
  title: string;
  options: string[];
  onChange: Function;
  info?: any;
  ref?: RefObject<FC<Props>>
}

const SelectForm: FC<Props> = ({ title, options, info}) => {
  const { register } = useForm({
    mode: 'onChange'
  });

  const onChange = () => {
    // add actions
  }

  const formName = title.replace(' ', '');

  return (
    <form onChange={onChange}>
      <label htmlFor={formName}>{title}:</label>
      <select {...register(formName)}>
        {options.map(v => <option value={v}/>)}
      </select>
      {info && <div>{info}</div>}
    </form>
  )
}

export default SelectForm
