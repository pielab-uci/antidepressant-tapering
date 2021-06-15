import * as React from 'react';
import { Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useRef } from 'react';
import {
  useHistory, useLocation,
} from 'react-router';
import { css } from '@emotion/react';
import { PrescribedDrug } from '../../types';
import PrescriptionForm from '../../components/PrescriptionForm/PrescriptionForm';
import { RootState } from '../../redux/reducers';
import { TaperConfigState } from '../../redux/reducers/taperConfig';
import { ADD_NEW_DRUG_FORM } from '../../redux/actions/taperConfig';

const CreateTaperConfiguration = () => {
  const { prescribedDrugs, isInputComplete } = useSelector<RootState, TaperConfigState>((state) => state.taperConfig);
  const dispatch = useDispatch();
  const history = useHistory();
  const urlSearchParams = useRef<URLSearchParams>(new URLSearchParams(useLocation().search));
  const addNewPrescriptionForm = useCallback(() => {
    dispatch({
      type: ADD_NEW_DRUG_FORM,
    });
  }, []);

  useEffect(() => {

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
    <div
      className='create-taper-configuration'
      css={css`
        display: flex;
        flex-direction: column;
        flex: 1;
        height: 100%;
        `}>
      <div css={css`
        padding-top: 45px;
        background-color: white;
        border-radius: 17px;
        overflow-y: scroll;
        margin-bottom: 34px;
        flex: 1;`}>
        {prescribedDrugs && renderPrescriptionForms(prescribedDrugs)}
      </div>
      <div css={css`
        margin-top: auto;
        margin-bottom: 21px;`}>
        <Button onClick={addNewPrescriptionForm}>Add Drug</Button>
        <Button onClick={moveToEditPage} disabled={!isInputComplete}>Next</Button>
      </div>
    </div>
  );
};

export default CreateTaperConfiguration;
