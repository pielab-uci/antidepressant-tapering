import * as React from 'react';
import { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { css } from '@emotion/react';
import { Button, Input, Table } from 'antd';
import { useHistory } from 'react-router';
import { Patient } from '../types';
import { SET_CURRENT_PATIENT, SetCurrentPatientAction } from '../redux/actions/user';

interface Props {
  patients: Omit<Patient, 'password'>[]
}

const headerStyle = css`
  display: flex;
  align-items: center
`;

const titleStyle = css`
  font-size: 32px;
  font-weight: bold;
  margin-right: 61px;
  margin-bottom: 0;
  align-self: center;
`;

const searchStyle = css`
  height: 50px;
  width: 588px;
  padding-top: 10px;
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

  return (
    // <div css={patientListStyle}>
    <div>
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
