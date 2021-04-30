import * as React from 'react';
import {FC, useCallback, useContext} from "react";
import {PrescriptionFormContext} from "./PrescriptionForm/PrescriptionForm";
import {Button} from "antd";

interface Props {
  form: string;
  time: "Current" | "Next"
  dosage: string;
}

const DrugUnit: FC<Props> = ({time, form, dosage}) => {
  const context = useContext(PrescriptionFormContext);
  const {dispatch, id} = context;
  const {dosages, action: dosageChangeAction} = context[time];

  const onIncrement = useCallback(() => {
    dispatch(dosageChangeAction({
      id,
      dosage: {
        dosage,
        quantity: dosages[dosage] + 1
      }
    }))
  }, [dosages]);

  const onDecrement = useCallback(() => {
    dispatch(dosageChangeAction({
      id,
      dosage: {
        dosage,
        quantity: dosages[dosage] - 1
      }
    }))
  }, [dosages])

  return (
    <>
      <div>{form}: {dosage}</div>
      <Button onClick={onIncrement}>+</Button>
      <div>{dosages[dosage]}</div>
      <Button onClick={onDecrement}>-</Button>
    </>
  )
}

export default DrugUnit;
