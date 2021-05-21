import * as React from 'react';
import { FC, useCallback } from 'react';
import { useHistory } from 'react-router';
import { Patient } from '../types';

interface Props {
  patient: Omit<Patient, 'password'>
}

const PatientNameCard: FC<Props> = ({ patient }) => {
  const history = useHistory();

  const onClickPatientNameCard = useCallback((e: React.MouseEvent) => {
    history.push(`/patient/${patient.id}`);
  }, []);

  return (
    <div style={{ border: '1px solid grey' }} onClick={onClickPatientNameCard}>
      <img src={patient.image}/>
      <div>{patient.name}</div>
    </div>
  );
};

export default PatientNameCard;
