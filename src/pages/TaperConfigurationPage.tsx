import * as React from 'react';
import {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Checkbox, Input } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Prompt, useLocation } from 'react-router';
import ProjectedSchedule from '../components/ProjectedSchedule';
import { RootState } from '../redux/reducers';
import { TaperConfigState } from '../redux/reducers/taperConfig';
import PrescriptionForm from '../components/PrescriptionForm/PrescriptionForm';
import {
  ADD_NEW_DRUG_FORM,
  addOrUpdateTaperConfigRequest,
  changeMessageForPatient,
  FETCH_TAPER_CONFIG_REQUEST,
  FetchTaperConfigRequestAction,
  GENERATE_SCHEDULE,
  INIT_NEW_TAPER_CONFIG,
  InitTaperConfig, EMPTY_TAPER_CONFIG_PAGE, EmptyTaperConfigPage,
  SHARE_WITH_PATIENT_APP_REQUEST,
  SHARE_WITH_PATIENT_EMAIL_REQUEST,
  TOGGLE_SHARE_PROJECTED_SCHEDULE_WITH_PATIENT, AddNewDrugFormAction, changeNoteAndInstructions,
} from '../redux/actions/taperConfig';
import { PrescribedDrug } from '../types';

const { TextArea } = Input;

const TaperConfigurationPage = () => {
  const {
    prescriptionFormIds,
    messageForPatient,
    noteAndInstructionsForPatient,
    shareProjectedScheduleWithPatient,
    prescribedDrugs,
    isSaved,
  } = useSelector<RootState, TaperConfigState>((state) => state.taperConfig);
  const [canGenerateSchedule, setCanGenerateSchedule] = useState(false);
  const dispatch = useDispatch();
  const urlSearchParams = useRef<URLSearchParams>(new URLSearchParams(useLocation().search));

  useEffect(() => {
    const id = urlSearchParams.current.get('id');
    console.log('id: ', id);
    if (id) {
      dispatch<FetchTaperConfigRequestAction>({
        type: FETCH_TAPER_CONFIG_REQUEST,
        data: parseInt(id, 10),
      });
    } else {
      dispatch<InitTaperConfig>({
        type: INIT_NEW_TAPER_CONFIG,
        data: { clinicianId: parseInt(urlSearchParams.current.get('clinicianId')!, 10), patientId: parseInt(urlSearchParams.current!.get('patientId')!, 10) },
      });
    }
    return () => {
      dispatch<EmptyTaperConfigPage>({
        type: EMPTY_TAPER_CONFIG_PAGE,
      });
    };
  }, []);

  useEffect(() => {
    const condition = !prescribedDrugs?.map(
      (drug) => drug.name
        && drug.brand
        && drug.form
        && drug.intervalEndDate
        && drug.intervalCount !== 0
        && drug.nextDosages.length !== 0,
    ).some((cond) => !cond);
    setCanGenerateSchedule(condition);

    if (prescribedDrugs && prescribedDrugs.filter((d) => !d.prevVisit).length === 0) {
      dispatch<AddNewDrugFormAction>({
        type: ADD_NEW_DRUG_FORM,
      });
    }
  }, [prescribedDrugs]);

  const toggleShareProjectedSchedule = useCallback(() => {
    dispatch({
      type: TOGGLE_SHARE_PROJECTED_SCHEDULE_WITH_PATIENT,
    });
  }, []);

  // todo: do I need prescriptionFormIds in addition to ids of prescribedDrugs?
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

  const onMessageCopied = useCallback(() => {
    alert('Message copied.');
  }, []);

  const onNotesAndInstructionCopied = useCallback(() => {
    alert('Notes and Instructions copied.');
  }, []);
  const onChangeMessageForPatient = useCallback((e) => {
    dispatch(changeMessageForPatient(e.target.value));
  }, []);

  const onChangeNoteAndInstructions = useCallback((e) => {
    dispatch(changeNoteAndInstructions(e.target.value));
  }, []);

  const saveTaperConfiguration = useCallback(() => {
    if (prescribedDrugs) {
      dispatch(addOrUpdateTaperConfigRequest({
        clinicianId: parseInt(urlSearchParams.current.get('clinicianId')!, 10),
        patientId: parseInt(urlSearchParams.current.get('patientId')!, 10),
        prescribedDrugs,
      }));
    }
  }, [prescribedDrugs]);

  const renderPrescriptionForms = (prescribedDrugs: PrescribedDrug[]) => {
    console.group('renderPrescriptionForms');
    console.log(prescribedDrugs);
    console.groupEnd();
    const notFromPrevVisit = prescribedDrugs.filter((prescribedDrug) => !prescribedDrug.prevVisit);
    return notFromPrevVisit.map(
      (drug) => <PrescriptionForm key={`PrescriptionForm${drug.id}`} prescribedDrug={drug}/>,
    );
  };

  const noteAndInstructionsPlaceholder = useRef('e.g., If you experience severe withdrawal symptoms, go back to the previous dosage. / call your provider / come back to provider\'s office.');

  return (
    <>
      <Prompt when={!isSaved}
              message={'Are you sure you want to leave?'}/>

      {prescribedDrugs && renderPrescriptionForms(prescribedDrugs)}
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
      <CopyToClipboard text={messageForPatient} onCopy={onMessageCopied}>
        <Button>Copy to Clipboard</Button>
      </CopyToClipboard>

      <h3>Note & Instructions</h3>
      <TextArea value={noteAndInstructionsForPatient}
                defaultValue={noteAndInstructionsForPatient}
                onChange={onChangeNoteAndInstructions}
                placeholder={noteAndInstructionsPlaceholder.current}
      />
      <CopyToClipboard text={noteAndInstructionsForPatient} onCopy={onNotesAndInstructionCopied}>
        <Button>Copy to Clipboard</Button>
      </CopyToClipboard>

      <Checkbox checked={shareProjectedScheduleWithPatient} onChange={toggleShareProjectedSchedule}>
        Share projected schedule
      </Checkbox>
      <Button onClick={shareWithApp}>App</Button>
      <Button onClick={shareWithEmail}>Email</Button>
      <Button onClick={saveTaperConfiguration}>Save configuration</Button>
    </>
  );
};

export default TaperConfigurationPage;
