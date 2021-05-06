import * as React from 'react';
import { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Checkbox, Input } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ProjectedSchedule from '../components/ProjectedSchedule';
import { RootState } from '../redux/reducers';
import { TaperConfigState } from '../redux/reducers/taperConfig';
import PrescriptionForm from '../components/PrescriptionForm/PrescriptionForm';
import {
  ADD_NEW_DRUG_FORM, changeMessageForPatient,
  GENERATE_SCHEDULE,
  SHARE_WITH_PATIENT_APP_REQUEST,
  SHARE_WITH_PATIENT_EMAIL_REQUEST, TOGGLE_SHARE_PROJECTED_SCHEDULE_WITH_PATIENT,
} from '../redux/actions/taperConfig';
import SelectInterval from '../components/SelectInterval';

const { TextArea } = Input;

const TaperConfigurationPage = () => {
  const {
    drugs,
    prescriptionFormIds,
    messageForPatient,
    shareProjectedScheduleWithPatient,
    projectedSchedule,
    showMessageForPatient,
    intervalStartDate,
    intervalEndDate,
  } = useSelector<RootState, TaperConfigState>((state) => state.taperConfig);
  const dispatch = useDispatch();

  useEffect(() => {
    if (showMessageForPatient) {
      dispatch(
        changeMessageForPatient(
          { startDate: intervalStartDate, endDate: intervalEndDate! },
        ),
      );
    }
  }, [projectedSchedule]);

  const toggleShareProjectedSchedule = useCallback(() => {
    dispatch({
      type: TOGGLE_SHARE_PROJECTED_SCHEDULE_WITH_PATIENT,
    });
  }, []);

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

  const onChangeMessageForPatient = useCallback((e) => {
    dispatch(changeMessageForPatient(e.target.value));
  }, []);

  const renderPrescriptionForms = (ids: number[]) => {
    return ids.map(
      (id) => <PrescriptionForm key={`PrescriptionForm${id}`} drugs={drugs} id={id}/>,
    );
  };

  return (
    <>
      {renderPrescriptionForms(prescriptionFormIds)}
      <hr/>
      <Button onClick={addNewPrescriptionForm}>Add Drug</Button>
      <hr/>
      <SelectInterval/>
      <hr/>
      <Button onClick={generateSchedule}>Generate schedule</Button>
      <hr/>
      <ProjectedSchedule/>
      <hr/>

      <h3>Share with Patient</h3>
      <TextArea
        value={messageForPatient}
        defaultValue={messageForPatient}
        onChange={onChangeMessageForPatient}/>
      <Checkbox checked={shareProjectedScheduleWithPatient} onChange={toggleShareProjectedSchedule}>
        Share projected schedule
      </Checkbox>
      <Button onClick={shareWithApp}>App</Button>
      <Button onClick={shareWithEmail}>Email</Button>
      <CopyToClipboard text={messageForPatient} onCopy={onCopy}>
        <Button>Copy to Clipboard</Button>
      </CopyToClipboard>
    </>
  );
};

export default TaperConfigurationPage;
