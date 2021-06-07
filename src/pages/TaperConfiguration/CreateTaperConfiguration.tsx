import * as React from 'react';
import { Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useRef } from 'react';
import {
  useHistory, useLocation,
} from 'react-router';
import { PrescribedDrug } from '../../types';
import PrescriptionForm from '../../components/PrescriptionForm/PrescriptionForm';
import { RootState } from '../../redux/reducers';
import { TaperConfigState } from '../../redux/reducers/taperConfig';
import { ADD_NEW_DRUG_FORM } from '../../redux/actions/taperConfig';

const CreateTaperConfiguration = () => {
  const { prescribedDrugs } = useSelector<RootState, TaperConfigState>((state) => state.taperConfig);
  const dispatch = useDispatch();
  const history = useHistory();
  const urlSearchParams = useRef<URLSearchParams>(new URLSearchParams(useLocation().search));
  const addNewPrescriptionForm = useCallback(() => {
    dispatch({
      type: ADD_NEW_DRUG_FORM,
    });
  }, []);

  const moveToEditPage = () => {
    // TODO: continue from here - it makes taper-configuration/create/taper-configuration/edit..
    history.push(`/taper-configuration/edit/?clinicianId=${urlSearchParams.current.get('clinicianId')}&patientId=${urlSearchParams.current.get('patientId')}`);
  };

  const renderPrescriptionForms = (prescribedDrugs: PrescribedDrug[]) => {
    const notFromPrevVisit = prescribedDrugs.filter((prescribedDrug) => !prescribedDrug.prevVisit);
    return notFromPrevVisit.map(
      (drug) => <PrescriptionForm key={`PrescriptionForm${drug.id}`} prescribedDrug={drug}/>,
    );
  };

  return (
    <> {prescribedDrugs && renderPrescriptionForms(prescribedDrugs)}
      <Button onClick={addNewPrescriptionForm}>Add Drug</Button>
      <Button onClick={moveToEditPage}>Next</Button>
    </>
  );
};

export default CreateTaperConfiguration;
