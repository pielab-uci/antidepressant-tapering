import * as React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Button, Checkbox } from 'antd';
import { useCallback, useRef } from 'react';
import TextArea from 'antd/es/input/TextArea';
import { useDispatch, useSelector } from 'react-redux';
import { Prompt } from 'react-router';
import {
  addOrUpdateTaperConfigRequest,
  changeMessageForPatient, changeNoteAndInstructions,
  SHARE_WITH_PATIENT_APP_REQUEST, SHARE_WITH_PATIENT_EMAIL_REQUEST,
  TOGGLE_SHARE_PROJECTED_SCHEDULE_WITH_PATIENT,
} from '../../redux/actions/taperConfig';
import ProjectedSchedule from '../../components/Schedule/ProjectedSchedule';
import { RootState } from '../../redux/reducers';
import { TaperConfigState } from '../../redux/reducers/taperConfig';

const EditTaperConfiguration = () => {
  const dispatch = useDispatch();
  const {
    instructionsForPharmacy, instructionsForPatient,
    shareProjectedScheduleWithPatient, isInputComplete, isSaved,
  } = useSelector<RootState, TaperConfigState>((state) => state.taperConfig);

  const toggleShareProjectedSchedule = useCallback(() => {
    dispatch({
      type: TOGGLE_SHARE_PROJECTED_SCHEDULE_WITH_PATIENT,
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

  const onMessageCopied = useCallback(() => {
    alert('Message copied.');
  }, []);

  const onNotesAndInstructionCopied = useCallback(() => {
    alert('Notes and Instructions copied.');
  }, []);

  const onChangeMessageForPatient = useCallback((e) => {
    dispatch(changeMessageForPatient(e.target.value));
  }, []);

  const onChangeInstructionsForPharmacy = useCallback((e) => {
    dispatch(changeNoteAndInstructions(e.target.value));
  }, []);

  /*
  TODO: save taper configuration -> not prescribedDrugs, but projectedSchedule
  const saveTaperConfiguration = useCallback(() => {
    if (prescribedDrugs) {
      dispatch(addOrUpdateTaperConfigRequest({
        clinicianId: parseInt(urlSearchParams.current.get('clinicianId')!, 10),
        patientId: parseInt(urlSearchParams.current.get('patientId')!, 10),
        prescribedDrugs,
      }));
    }
  }, [prescribedDrugs]);
   */

  const saveTaperConfiguration = () => {};
  const instructionsForPatientPlaceholder = useRef('e.g., If you experience severe withdrawal symptoms, go back to the previous dosage. / call your provider / come back to provider\'s office.');

  return (
    <>
      <Prompt when={!isSaved}
              message={'Are you sure you want to leave?'}/>
      <ProjectedSchedule/>
      <hr/>

      <h3>Instructions for Pharmacy</h3>
      <TextArea value={instructionsForPharmacy}
                defaultValue={instructionsForPharmacy}
                onChange={onChangeInstructionsForPharmacy}
                rows={6}
      />
      <CopyToClipboard text={instructionsForPharmacy} onCopy={onNotesAndInstructionCopied}>
        <Button>Copy to Clipboard</Button>
      </CopyToClipboard>

      <h3>Instructions for Patient</h3>
      <TextArea
        value={instructionsForPatient}
        defaultValue={instructionsForPatient}
        onChange={onChangeMessageForPatient}
        placeholder={instructionsForPatientPlaceholder.current}
        rows={6}
      />
      <CopyToClipboard text={instructionsForPatient} onCopy={onMessageCopied}>
        <Button>Copy to Clipboard</Button>
      </CopyToClipboard>

      <Checkbox checked={shareProjectedScheduleWithPatient} onChange={toggleShareProjectedSchedule}>
        Share projected schedule
      </Checkbox>
      <Button onClick={shareWithApp}>App</Button>
      <Button onClick={shareWithEmail}>Email</Button>
      <Button onClick={saveTaperConfiguration} disabled={!isInputComplete}>Save configuration</Button>
    </>
  );
};

export default EditTaperConfiguration;
