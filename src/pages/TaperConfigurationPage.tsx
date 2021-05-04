import * as React from 'react';
import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Checkbox } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ProjectedSchedule from '../components/ProjectedSchedule';
import { RootState } from '../redux/reducers';
import { TaperConfigState } from '../redux/reducers/taperConfig';
import PrescriptionForm from '../components/PrescriptionForm/PrescriptionForm';
import {
  ADD_NEW_DRUG_FORM,
  GENERATE_SCHEDULE,
  SHARE_WITH_PATIENT_APP_REQUEST,
  SHARE_WITH_PATIENT_EMAIL_REQUEST,
} from '../redux/actions/taperConfig';

const TaperConfigurationPage = () => {
  const { drugs, prescriptionFormIds, messageForPatient } = useSelector<RootState, TaperConfigState>((state) => state.taperConfig);
  const dispatch = useDispatch();

  const addNewPrescriptionForm = useCallback(() => {
    dispatch({
      type: ADD_NEW_DRUG_FORM,
    });
  }, []);

  const generateSchedule = useCallback(() => {
    dispatch({
      type: GENERATE_SCHEDULE,
    });
  }, []);

  const shareWithApp = useCallback(() => {
    dispatch({
      type: SHARE_WITH_PATIENT_APP_REQUEST,
    });
  }, []);

  const shareWithEmail = useCallback(() => {
    dispatch({
      type: SHARE_WITH_PATIENT_EMAIL_REQUEST,
    });
  }, []);

  const onCopy = useCallback(() => {
    alert('Message copied.');
  }, []);

  const renderPrescriptionForms = (ids: number[]) => ids.map((id) => <PrescriptionForm key={`PrescriptionForm${id}`} drugs={drugs} id={id} />);

  return (
    <>
      {renderPrescriptionForms(prescriptionFormIds)}
      <Button onClick={addNewPrescriptionForm}>Add Drug</Button>
      <Button onClick={generateSchedule}>Generate schedule</Button>
      <hr />
      <ProjectedSchedule />
      <hr />

      <h3>Share with Patient</h3>
      <TextArea value={messageForPatient} />
      {/* <Checkbox checked={}></Checkbox> */}
      <Button onClick={shareWithApp}>App</Button>
      <Button onClick={shareWithEmail}>Email</Button>
      <CopyToClipboard text={messageForPatient} onCopy={onCopy}>
        <Button>Copy to Clipboard</Button>
      </CopyToClipboard>
    </>
  );
};

export default TaperConfigurationPage;
