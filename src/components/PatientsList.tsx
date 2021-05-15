import * as React from 'react';
import { FC } from 'react';
import { Patient } from '../types';
import PatientNameCard from './PatientNameCard';

interface Props {
  patients: Omit<Patient, 'password'>[]
}
const PatientsList: FC<Props> = ({ patients }) => (
  <div style={{ border: '1px solid black' }}>
    <h3>Patients</h3>
    {patients.map(
      (patient) => <PatientNameCard key={`${patient.id}_${patient.name}`} patient={patient}/>,
    )}
  </div>
);

export default PatientsList;
