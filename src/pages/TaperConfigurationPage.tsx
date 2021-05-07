import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
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
import { messageGenerator } from './utils';

const { TextArea } = Input;

const TaperConfigurationPage = () => {
  const {
    prescriptionFormIds,
    messageForPatient,
    shareProjectedScheduleWithPatient,
    projectedSchedule,
    showMessageForPatient,
    prescribedDrugs,
  } = useSelector<RootState, TaperConfigState>((state) => state.taperConfig);
  const [canGenerateSchedule, setCanGenerateSchedule] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (showMessageForPatient) {
      dispatch(
        changeMessageForPatient(
          messageGenerator(prescribedDrugs),
        ),
      );
    }
  }, [projectedSchedule]);

  useEffect(() => {
    const condition = !prescribedDrugs.map(
      (drug) => drug.name
        && drug.brand
        && drug.form
        && drug.intervalEndDate
        && drug.intervalCount !== 0
        && drug.nextDosages.length !== 0,
    ).some((cond) => !cond);
    setCanGenerateSchedule(condition);
  }, [prescribedDrugs]);

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
      (id) => <PrescriptionForm key={`PrescriptionForm${id}`} id={id}/>,
    );
  };

  return (
    <>
      {renderPrescriptionForms(prescriptionFormIds)}
      <hr/>
      <Button onClick={addNewPrescriptionForm}>Add Drug</Button>
      <hr/>
      {/* TODO: on click Generate Schedule button, mark unfilled inputs..? */}
      <Button onClick={generateSchedule} disabled={!canGenerateSchedule}>Generate schedule</Button>
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
