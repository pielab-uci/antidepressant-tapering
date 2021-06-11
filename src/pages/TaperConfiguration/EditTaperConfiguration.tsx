import * as React from 'react';
import { Button } from 'antd';
import { useCallback, useRef } from 'react';
import { Prompt, useHistory, useLocation } from 'react-router';
import ProjectedSchedule from '../../components/Schedule/ProjectedSchedule';

const EditTaperConfiguration = () => {
  const history = useHistory();
  const urlSearchParams = useRef<URLSearchParams>(new URLSearchParams(useLocation().search));
  const moveToCreatePage = () => {
    history.goBack();
  };

  const moveToConfirmPage = () => {
    const clinicianId = urlSearchParams.current.get('clinicianId');
    const patientId = urlSearchParams.current.get('patientId');
    history.push(`/taper-configuration/confirm/?clinicianId=${clinicianId}&patientId=${patientId}`);
  };

  return (
    <>
      {/* <Prompt when={!isSaved} */}
      {/*        message={'Are you sure you want to leave?'}/> */}
      <ProjectedSchedule editable={true}/>
      <hr/>

      <Button onClick={moveToCreatePage}>Prev</Button>
      <Button onClick={moveToConfirmPage}>Next</Button>

    </>
  );
};

export default EditTaperConfiguration;
