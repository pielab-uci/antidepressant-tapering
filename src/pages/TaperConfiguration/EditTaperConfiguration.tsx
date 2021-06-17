import * as React from 'react';
import { Button } from 'antd';
import {
  useCallback, useContext, useEffect, useRef,
} from 'react';
import { Prompt, useHistory, useLocation } from 'react-router';
import { css } from '@emotion/react';
import { useRouteMatch } from 'react-router-dom';
import ProjectedSchedule from '../../components/Schedule/ProjectedSchedule';

const wrapperStyle = css`
width: 100%;
display: flex;
flex-direction: column;
`;

const projectedScheduleStyle = css`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  width: 100%;
  background-color: white;
  padding: 21px 38px 71px 38px;
  border-radius: 17px;
  margin-bottom: 34px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
`;

const buttonStyle = css`
  margin-bottom: 21px;
  display: flex;
  justify-content: space-between;

  & > button {
    width: 180px;
    height: 38px;
    border-radius: 10px;
  }
`;

const EditTaperConfiguration = () => {
  const history = useHistory();
  const urlSearchParams = useRef<URLSearchParams>(new URLSearchParams(useLocation().search));
  const { url } = useRouteMatch();

  const moveToCreatePage = () => {
    history.push(url.replace('edit', 'create'));
  };

  const moveToConfirmPage = () => {
    // const clinicianId = urlSearchParams.current.get('clinicianId');
    // const patientId = urlSearchParams.current.get('patientId');
    // history.push(`/taper-configuration/confirm/?clinicianId=${clinicianId}&patientId=${patientId}`);
    history.push(url.replace('edit', 'confirm'));
  };

  return (
    <div css={wrapperStyle}>
      <div css={projectedScheduleStyle}>
        {/* <Prompt when={!isSaved} */}
        {/*        message={'Are you sure you want to leave?'}/> */}
        <ProjectedSchedule title={'Projected Schedule based on the rate of reduction you specified'}
                           editable={true}/>
      </div>
      <div css={buttonStyle}>
        <Button onClick={moveToCreatePage}>Previous</Button>
        <Button type='primary' onClick={moveToConfirmPage}>Next</Button>
      </div>
    </div>
  );
};

export default EditTaperConfiguration;
