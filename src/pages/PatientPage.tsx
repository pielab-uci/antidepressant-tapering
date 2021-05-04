import * as React from 'react';
import { FC } from 'react';
import { Patient } from '../types';

interface Props {
  patient: Pick<Patient, 'name'>
}
const PatientPage: FC<Props> = ({ patient }) => (
  <>
    <div>{patient.name}</div>
    <hr />
    <div>Schedule</div>

    <button>New Schedule</button>
    <button>Symptom Tracker</button>
  </>
);

export default PatientPage;
