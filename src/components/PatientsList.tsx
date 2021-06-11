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
    <div css={css`
      background-color: #fafafa;
      box-shadow: 0px 3px 6px black;
      border-radius: 20px;
      margin: 52px 59px 34px 65px;
      //width: 100%;
      height: 100%;
      padding: 31px 88px 21px 88px;
    `}>
      <div css={css`
        display: flex;
        align-items: center`}>
        <h3 css={css`
          font-size: 32px;
          font-weight: bold;
          margin-right: 61px;
        `}>Patients</h3>
        <Input.Search
          placeholder={'Search'}
          css={css`
            height: 41px;
            width: 588px;
          `}
        />
        <Button
          type={'primary'}
          css={css`
            height: 41px;
            margin-left: auto;
            border-radius: 17px;`}>New Patient</Button>
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
