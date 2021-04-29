import * as React from 'react';
import {Patient} from "../types";
import {FC} from "react";

interface Props {
  patient: Pick<Patient, "name">
}
const PatientPage: FC<Props> = ({ patient }) => {
  return (
    <>
      <div>{patient.name}</div>
      <hr/>
      <div>Schedule</div>

      <button>New Schedule</button>
      <button>Symptom Tracker</button>
    </>
  )
}

export default PatientPage;
