import * as React from 'react';
import {useState} from 'react';
import ProjectedSchedule from "../components/ProjectedSchedule";
import {RootState} from "../redux/reducers";
import {useSelector, useDispatch} from "react-redux";
import {TaperConfigState} from "../redux/reducers/taperConfig";
import PrescriptionForm from "../components/PrescriptionForm/PrescriptionForm";
import {ADD_NEW_DRUG_FORM, GENERATE_SCHEDULE} from "../redux/actions/taperConfig";
import {Button} from "antd";
import {useCallback} from "react";
import TextArea from "antd/es/input/TextArea";

const TaperConfigurationPage = () => {
  const {drugs, prescriptionFormIds} = useSelector<RootState, TaperConfigState>(state => state.taperConfig);
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');

  const addNewPrescriptionForm = useCallback(() => {
    dispatch({
      type: ADD_NEW_DRUG_FORM
    });
  }, []);

  const generateSchedule = useCallback(() => {
    dispatch({
      type: GENERATE_SCHEDULE
    })
  }, []);


  const renderPrescriptionForms = (ids: number[]) => ids.map(id => <PrescriptionForm key={`PrescriptionForm${id}`} drugs={drugs} id={id}/>)

  return (
    <>
      {renderPrescriptionForms(prescriptionFormIds)}
      <Button onClick={addNewPrescriptionForm}>Add Drug</Button>
      <Button onClick={generateSchedule}>Generate schedule</Button>
      <hr/>
      <ProjectedSchedule/>
      <hr/>

      <h3>Share with Patient</h3>
      <TextArea value={message}/>
      <button>App</button>
      <button>Email</button>
      <button>Text File</button>
    </>
  )
}

export default TaperConfigurationPage;
