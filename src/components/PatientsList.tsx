import * as React from 'react';
import { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { css } from '@emotion/react';
import { useHistory } from 'react-router';
import Button from 'antd/es/button';
import Input from 'antd/es/input';
import Table from 'antd/es/table';
import { SET_CURRENT_PATIENT, SetCurrentPatientAction } from '../redux/actions/user';
import { Patient } from '../types';

interface Props {
  patients: Omit<Patient, 'password'>[]
}

const headerStyle = css`
  display: flex;
  align-items: center
`;

const titleStyle = css`
  //font-size: 32px;
  font-size: 1.5rem;
  font-weight: bold;
  margin-right: 61px;
  margin-bottom: 0;
  align-self: center;
`;

const searchStyle = css`
  height: 50px;
  width: 588px;
  padding-top: 10px;
  
  & .ant-input {
    border-radius: 10px;
  }
`;

const buttonStyle = css`
  align-self: center;
  height: 41px;
  margin-left: auto;
  border-radius: 17px;
`;

const PatientsList: FC<Props> = ({ patients }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch<SetCurrentPatientAction>({
      type: SET_CURRENT_PATIENT,
      data: -1,
    });
  }, []);

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Medication', dataIndex: 'drug', key: 'drug' },
    { title: 'Last Visit', dataIndex: 'recentVisit', key: 'recentVisit' },
  ];

  /*
  const renderDrugsAndDosages = useCallback(() => {
    return !currentPatient!.taperingConfiguration
      ? <div>Drug(s): Drugs and dosages will appear hear.</div>
      : prescribedDrugs && prescribedDrugs.reduce((prev, prescribedDrug) => {
        const dosages = prescribedDrug.upcomingDosages.reduce(
          (prevDosageStr, dosage) => `${prevDosageStr}${dosage.quantity} * ${dosage.dosage}`, '',
        );
        return `${prev} ${prescribedDrug.brand} (${dosages})`;
      }, 'Drug(s):');
  }, [currentPatient, prescribedDrugs]);
   */
  return (
    <div css={css`height:100%;`}>
      <div css={headerStyle}>
        <h3 css={titleStyle}>Patients</h3>
        <Input.Search
          placeholder={'Search'}
          css={searchStyle}
        />
        <Button
          type={'primary'}
          css={buttonStyle}>New Patient</Button>
      </div>
      <Table
        css={css`font-size: 1.2rem;`}
        columns={columns}
        dataSource={patients.map((d) => ({ ...d, key: `${d.name}_${d.id}` }))}
        onRow={(record) => ({
          onClick: () => {
            console.log('record: ', record);
            history.push(`/patient/${record.id}`);
          },
        })
        }
      />
    </div>
  );
};

export default PatientsList;
