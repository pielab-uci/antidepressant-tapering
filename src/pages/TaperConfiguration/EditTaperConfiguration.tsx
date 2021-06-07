import * as React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Button } from 'antd';
import { useCallback, useRef } from 'react';
import TextArea from 'antd/es/input/TextArea';
import { useDispatch, useSelector } from 'react-redux';
import { Prompt, useHistory, useLocation } from 'react-router';
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
  const history = useHistory();
  const {
    instructionsForPharmacy, instructionsForPatient,
    shareProjectedScheduleWithPatient, isInputComplete, isSaved,
  } = useSelector<RootState, TaperConfigState>((state) => state.taperConfig);
  const urlSearchParams = useRef<URLSearchParams>(new URLSearchParams(useLocation().search));
  const moveToCreatePage = () => {
    history.goBack();
  };

  const moveToConfirmPage = () => {
    const clinicianId = urlSearchParams.current.get('clinicianId');
    const patientId = urlSearchParams.current.get('patientId');
    history.push(`/taper-configuration/confirm/?clinicianId=${clinicianId}&patientId=${patientId}`);
  };

  const onNotesAndInstructionCopied = useCallback(() => {
    alert('Notes and Instructions copied.');
  }, []);

  const onChangeMessageForPatient = useCallback((e) => {
    dispatch(changeMessageForPatient(e.target.value));
  }, []);

  const onChangeInstructionsForPharmacy = useCallback((e) => {
    dispatch(changeNoteAndInstructions(e.target.value));
  }, []);

  const instructionsForPatientPlaceholder = useRef('e.g., If you experience severe withdrawal symptoms, go back to the previous dosage. / call your provider / come back to provider\'s office.');

  return (
    <>
      {/* <Prompt when={!isSaved} */}
      {/*        message={'Are you sure you want to leave?'}/> */}
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
      <Button onClick={moveToCreatePage}>Prev</Button>
      <Button onClick={moveToConfirmPage}>Next</Button>

    </>
  );
};

export default EditTaperConfiguration;
