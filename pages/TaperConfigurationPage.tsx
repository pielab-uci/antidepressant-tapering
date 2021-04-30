import * as React from 'react';
import ProjectedSchedule from "../components/ProjectedSchedule";
import {RootState} from "../redux/reducers";
import {useSelector, useDispatch} from "react-redux";
import {TaperConfigState} from "../redux/reducers/taperConfig";
import PrescriptionForm from "../components/PrescriptionForm/PrescriptionForm";
import {ADD_NEW_DRUG_FORM} from "../redux/actions/taperConfig";
import {Button} from "antd";

const TaperConfigurationPage = () => {
  const {drugs, prescriptionFormIds} = useSelector<RootState, TaperConfigState>(state => state.taperConfig);
  const dispatch = useDispatch();
  const addNewPrescriptionForm = () => {
    dispatch({
      type: ADD_NEW_DRUG_FORM
    });
  }

  const renderPrescriptionForms = (ids: number[]) => ids.map(id => <PrescriptionForm key={`PrescriptionForm${id}`} drugs={drugs} id={id}/>)

  return (
    <>
      {renderPrescriptionForms(prescriptionFormIds)}
      <Button onClick={addNewPrescriptionForm}>Add Drug</Button>
      <hr/>
      <ProjectedSchedule/>
      <hr/>

      <h3>Share with Patient</h3>
      <textarea/>
      <button>App</button>
      <button>Email</button>
      <button>Text File</button>
    </>
  )
}

export default TaperConfigurationPage;
