import * as React from 'react';
import {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Checkbox, Input } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Prompt, useLocation, useRouteMatch } from 'react-router';
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
  TOGGLE_SHARE_PROJECTED_SCHEDULE_WITH_PATIENT,
} from '../redux/actions/taperConfig';
import { PrescribedDrug } from '../types';

const { TextArea } = Input;

const TaperConfigurationPage = () => {
  const {
    prescriptionFormIds,
    messageForPatient,
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
  }, [prescribedDrugs]);

  useEffect(() => {
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
    return prescribedDrugs.map(
      (drug) => <PrescriptionForm key={`PrescriptionForm${drug.id}`} prescribedDrug={drug}/>,
    );
  };
  // const renderPrescriptionForms = (ids: number[]) => {
  //   return ids.map(
  //     (id) => <PrescriptionForm key={`PrescriptionForm${id}`} id={id}/>,
  //   );
  // };

  return (
    <>
      <Prompt when={!isSaved}
              message={(location, action) => {
                console.log('location: ', location);
                console.log('action: ', action);
                return 'Are you sure you want to leave?';
              }
              }/>

       {/* {renderPrescriptionForms(prescriptionFormIds)} */}
      {/* {renderPrescriptionForms(prescribedDrugs.map((drug) => drug.id))} */}
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
