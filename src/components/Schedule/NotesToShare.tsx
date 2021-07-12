import * as React from 'react';
import { css } from '@emotion/react';
import TextArea from 'antd/es/input/TextArea';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Button from 'antd/es/button';
import { useDispatch, useSelector } from 'react-redux';
import { FC, useCallback, useRef } from 'react';
import { RootState } from '../../redux/reducers';
import { TaperConfigState } from '../../redux/reducers/taperConfig';
import { changeMessageForPatient, changeNoteAndInstructions } from '../../redux/actions/taperConfig';

const NotesToShare: FC<{ editable: boolean }> = ({ editable }) => {
  const {
    instructionsForPatient, instructionsForPharmacy, taperConfigs, currentTaperConfigId,
  } = useSelector<RootState, TaperConfigState>((state) => state.taperConfig);
  const dispatch = useDispatch();

  const patientInstructions = (editable: boolean) => {
    if (editable) {
      return instructionsForPatient;
    }
    return taperConfigs.find((config) => config.id === currentTaperConfigId)!.instructionsForPatient;
  };

  const pharmacyInstructions = (editable: boolean) => {
    if (editable) {
      return instructionsForPharmacy;
    }

    return taperConfigs.find((config) => config.id === currentTaperConfigId)!.instructionsForPharmacy;
  };

  const onChangeMessageForPatient = useCallback((e) => {
    dispatch(changeMessageForPatient(e.target.value));
  }, []);

  const onChangeInstructionsForPharmacy = useCallback((e) => {
    dispatch(changeNoteAndInstructions(e.target.value));
  }, []);

  const instructionsForPatientPlaceholder = useRef('e.g., If you experience severe withdrawal symptoms, go back to the previous dosage. / call your provider / come back to provider\'s office.');

  const onInstructionsForPatientCopied = useCallback(() => {
    alert('Instructions for patient copied.');
  }, []);

  const onInstructionsForPharmacyCopied = useCallback(() => {
    alert('Instructions for pharmacy copied.');
  }, []);

  return (
    <>
      <div>
        <div css={css`display: flex; margin-top: 40px; align-items: center;`}>
          <h3>Notes for Patient</h3>
          {!editable && <CopyToClipboard text={instructionsForPatient} onCopy={onInstructionsForPatientCopied}>
            <Button css={css`margin-left: 20px;`}>Copy to Clipboard</Button>
          </CopyToClipboard>}
        </div>
        {editable
          ? <TextArea
            value={patientInstructions(editable)}
            defaultValue={patientInstructions(editable)}
            onChange={onChangeMessageForPatient}
            placeholder={instructionsForPatientPlaceholder.current}
            rows={6}
            readOnly={!editable}
          />
          : <div css={css`margin: 10px 0 0 20px;`}>{patientInstructions(editable).split('\n').map((string, i) => <p key={i}>{string}</p>)}</div>}

      </div>

      <div>
        <div css={css`display: flex; margin-top: 40px; align-items: center;`}>
          <h3>Notes for Pharmacy</h3>
          {!editable && <CopyToClipboard text={instructionsForPharmacy} onCopy={onInstructionsForPharmacyCopied}>
            <Button css={css`margin-left: 20px;`}>Copy to Clipboard</Button>
          </CopyToClipboard>}
        </div>

        {editable
          ? <TextArea value={pharmacyInstructions(editable)}
                      defaultValue={pharmacyInstructions(editable)}
                      onChange={onChangeInstructionsForPharmacy}
                      rows={6}
                      readOnly={!editable}
          />
          : <div css={css`margin: 10px 0 0 20px;`}>{pharmacyInstructions(editable).split('\n').map((string, i) => <p key={i}>{string}</p>)}</div>}
      </div>
    </>
  );
};

export default NotesToShare;
