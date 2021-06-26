import * as React from 'react';
import Button from 'antd/es/button';
import { useDispatch, useSelector } from 'react-redux';
import {
  useCallback, useEffect, useRef,
} from 'react';
import {
  useHistory, useLocation,
} from 'react-router';
import { css } from '@emotion/react';
import { useRouteMatch } from 'react-router-dom';
import { PrescribedDrug } from '../../types';
import PrescriptionForm from '../../components/PrescriptionForm/PrescriptionForm';
import { RootState } from '../../redux/reducers';
import { TaperConfigState } from '../../redux/reducers/taperConfig';
import { ADD_NEW_DRUG_FORM } from '../../redux/actions/taperConfig';

const wrapperStyle = css`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: hidden;
  //height: 100%;
`;

const buttonsStyle = css`
  margin-bottom: 21px;
  display: flex;
  justify-content: space-between;

  & > button {
    width: 180px;
    height: 38px;
    border-radius: 10px;
  }
`;

const CreateTaperConfiguration = () => {
  const { prescribedDrugs, isInputComplete, patientId } = useSelector<RootState, TaperConfigState>((state) => state.taperConfig);
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const { path, url } = useRouteMatch();

  useEffect(() => {
    console.group('CreateTaperConfiguration');
    console.log('history: ', history);
    console.log('location: ', location);
    console.log('path: ', path);
    console.log('url: ', url);
    console.groupEnd();
  });

  const addNewPrescriptionForm = useCallback(() => {
    dispatch({
      type: ADD_NEW_DRUG_FORM,
    });
  }, []);

  const prescriptionFormStyle = css`
    padding-top: ${prescribedDrugs && prescribedDrugs.length !== 0 ? '25px' : '0px'};
    background-color: white;
    border-radius: 17px;
    height: 100%;
    overflow-y: scroll;
    margin-bottom: 34px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
  `;

  const moveToEditPage = () => {
    // TODO: continue from here - it makes taper-configuration/create/taper-configuration/edit..
    history.push(url.replace('create', 'edit'));
  };

  const renderPrescriptionForms = (prescribedDrugs: PrescribedDrug[]) => {
    const notFromPrevVisit = prescribedDrugs.filter((prescribedDrug) => !prescribedDrug.prevVisit);
    return notFromPrevVisit.map(
      (drug, i) => {
        return <PrescriptionForm
          key={`PrescriptionForm${drug.id}`}
          prescribedDrug={drug}
          addNewPrescriptionForm={addNewPrescriptionForm}
          // index={i}
          title={`Medication #${i + 1}`}
          numberOfMedications={notFromPrevVisit.length}/>;
      },
    );
  };

  const moveToPatientPage = () => {
    history.push(`/patient/${patientId}`);
  };
  return (
    <div
      className='create-taper-configuration'
      css={wrapperStyle}>
      <div className='create-taper-configuration-prescription-forms' css={prescriptionFormStyle}>
        {prescribedDrugs && renderPrescriptionForms(prescribedDrugs)}
      </div>
      <div css={buttonsStyle} className='create-taper-config-buttons'>
        <Button onClick={moveToPatientPage}>Cancel</Button>
        <Button css={css`background-color: #0984E3;`} type='primary' onClick={moveToEditPage} disabled={!isInputComplete}>Next</Button>
      </div>
    </div>
  );
};

export default CreateTaperConfiguration;
