import * as React from 'react';
import {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Checkbox, Input } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useLocation, useRouteMatch } from 'react-router';
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
  SET_CLINICIAN_PATIENT,
  SetClinicianPatientAction,
  SHARE_WITH_PATIENT_APP_REQUEST,
  SHARE_WITH_PATIENT_EMAIL_REQUEST,
  TOGGLE_SHARE_PROJECTED_SCHEDULE_WITH_PATIENT,
} from '../redux/actions/taperConfig';

const { TextArea } = Input;

const TaperConfigurationPage = () => {
  const {
    prescriptionFormIds,
    messageForPatient,
    shareProjectedScheduleWithPatient,
    prescribedDrugs,
  } = useSelector<RootState, TaperConfigState>((state) => state.taperConfig);
  const [canGenerateSchedule, setCanGenerateSchedule] = useState(false);
  const dispatch = useDispatch();
  const match = useRouteMatch<{ id: string }>();
  const urlSearchParams = useRef<URLSearchParams>(new URLSearchParams(useLocation().search));

  useEffect(() => {
    if (match.params) {
      console.log('FETCH_TAPER_CONFIG_REQUEST');
      dispatch<FetchTaperConfigRequestAction>({
        type: FETCH_TAPER_CONFIG_REQUEST,
        data: parseInt(match.params.id, 10),
      });
    } else {
      dispatch<SetClinicianPatientAction>({
        type: SET_CLINICIAN_PATIENT,
        data: { clinicianId: parseInt(urlSearchParams.current.get('clinicianId')!, 10), patientId: parseInt(urlSearchParams.current!.get('patientId')!, 10) },
      });
    }
  }, []);

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

  const onCopy = useCallback(() => {
    alert('Message copied.');
  }, []);

  const onChangeMessageForPatient = useCallback((e) => {
    dispatch(changeMessageForPatient(e.target.value));
  }, []);

  const saveTaperConfiguration = useCallback(() => {
    dispatch(addOrUpdateTaperConfigRequest({
      clinicianId: parseInt(urlSearchParams.current.get('clinicianId')!, 10),
      patientId: parseInt(urlSearchParams.current.get('patientId')!, 10),
      prescribedDrugs,
    }));
  }, [prescribedDrugs]);

  const renderPrescriptionForms = (ids: number[]) => {
    return ids.map(
      (id) => <PrescriptionForm key={`PrescriptionForm${id}`} id={id}/>,
    );
  };

  return (
    <>
       {/* {renderPrescriptionForms(prescriptionFormIds)} */}
      {renderPrescriptionForms(prescribedDrugs.map((drug) => drug.id))}
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
      <Button onClick={saveTaperConfiguration}>Save configuration</Button>
    </>
  );
};

export default TaperConfigurationPage;
