import * as React from 'react';
import {
  useCallback, useEffect, useRef,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Checkbox, Input } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Prompt, useLocation } from 'react-router';
import ProjectedSchedule from '../components/Schedule/ProjectedSchedule';
import { RootState } from '../redux/reducers';
import { TaperConfigState } from '../redux/reducers/taperConfig';
import PrescriptionForm from '../components/PrescriptionForm/PrescriptionForm';
import {
  ADD_NEW_DRUG_FORM,
  addOrUpdateTaperConfigRequest,
  changeMessageForPatient,
  FETCH_TAPER_CONFIG_REQUEST,
  FetchTaperConfigRequestAction,
  INIT_NEW_TAPER_CONFIG,
  InitTaperConfigAction,
  EMPTY_TAPER_CONFIG_PAGE,
  EmptyTaperConfigPage,
  SHARE_WITH_PATIENT_APP_REQUEST,
  SHARE_WITH_PATIENT_EMAIL_REQUEST,
  TOGGLE_SHARE_PROJECTED_SCHEDULE_WITH_PATIENT,
  changeNoteAndInstructions,
} from '../redux/actions/taperConfig';
import { PrescribedDrug } from '../types';
// import PrescribedDosageQuantities from '../components/PrescribedDosageQuantities';

const { TextArea } = Input;

const TaperConfigurationPage = () => {
  const {
    instructionsForPatient,
    instructionsForPharmacy,
    shareProjectedScheduleWithPatient,
    prescribedDrugs,
    isSaved,
    isInputComplete,
  } = useSelector<RootState, TaperConfigState>((state) => state.taperConfig);
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
      dispatch<InitTaperConfigAction>({
        type: INIT_NEW_TAPER_CONFIG,
        data: {
          clinicianId: parseInt(urlSearchParams.current.get('clinicianId')!, 10),
          patientId: parseInt(urlSearchParams.current.get('patientId')!, 10),
        },
      });
    }

    return () => {
      dispatch<EmptyTaperConfigPage>({
        type: EMPTY_TAPER_CONFIG_PAGE,
      });
    };
  }, []);

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

  // const renderPrescribedQuantites = (prescribedDrugs: PrescribedDrug[]) => {
  //   return prescribedDrugs.map((drug) => <PrescribedDosageQuantities key={`$PrescribedDosageQty${drug.id}`} prescribedDrug={drug}/>);
  // };

  const instructionsForPatientPlaceholder = useRef('e.g., If you experience severe withdrawal symptoms, go back to the previous dosage. / call your provider / come back to provider\'s office.');

  return (
    <>
      <Prompt when={!isSaved}
              message={'Are you sure you want to leave?'}/>

      {prescribedDrugs && renderPrescriptionForms(prescribedDrugs)}
      <hr/>
      <Button onClick={addNewPrescriptionForm}>Add Drug</Button>
      <hr/>
      <ProjectedSchedule/>
      <hr/>

      {/* {prescribedDrugs && renderPrescribedQuantites(prescribedDrugs)} */}

      <h3>Instructions for Pharmacy</h3>
      <TextArea value={instructionsForPharmacy}
                defaultValue={instructionsForPharmacy}
                onChange={onChangeInstructionsForPharmacy}
                rows={6}
      />
      <CopyToClipboard text={instructionsForPharmacy} onCopy={onNotesAndInstructionCopied}>
        <Button>Copy to Clipboard</Button>
      </CopyToClipboard>

      <h3>Instructions for Patients</h3>
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

export default TaperConfigurationPage;
