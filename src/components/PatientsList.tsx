import * as React from 'react';
import { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Patient } from '../types';
import PatientNameCard from './PatientNameCard';
import { SET_CURRENT_PATIENT, SetCurrentPatientAction } from '../redux/actions/user';

interface Props {
  patients: Omit<Patient, 'password'>[]
}
const PatientsList: FC<Props> = ({ patients }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch<SetCurrentPatientAction>({
      type: SET_CURRENT_PATIENT,
      data: -1,
    });
  }, []);

  return (
  <div style={{ border: '1px solid black' }}>
    <h3>Patients</h3>
    {patients.map(
      (patient) => <PatientNameCard key={`${patient.id}_${patient.name}`} patient={patient}/>,
    )}
  </div>
  );
};

export default PatientsList;
