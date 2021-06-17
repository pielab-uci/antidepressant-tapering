import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FC, useCallback, useRef, useState,
} from 'react';
import { Button } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { css } from '@emotion/react';
import { ProjectedScheduleChart, ProjectedScheduleTable } from '.';
import { RootState } from '../../redux/reducers';
import { TaperConfigState } from '../../redux/reducers/taperConfig';
import { PrescribedDrug, TableRowData } from '../../types';
import PrescribedQuantitiesForDrug from './PrescribedQuantitiesForDrug';
import { changeMessageForPatient, changeNoteAndInstructions } from '../../redux/actions/taperConfig';

export interface Schedule {
  drugs: PrescribedDrug[];
  data: TableRowData[];
}

const ProjectedSchedule: FC<{ editable: boolean, title: string }> = ({ editable, title }) => {
  const {
    projectedSchedule, scheduleChartData, finalPrescription, instructionsForPharmacy, instructionsForPatient,
  } = useSelector<RootState, TaperConfigState>((state) => state.taperConfig);
  const dispatch = useDispatch();

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
      {projectedSchedule.data.length
        ? <>
          <h3 css={css`font-size: 18px;
            color: #636E72;`}>{title}</h3>
          <div css={css`display: flex; justify-content: space-between;`}>
            {projectedSchedule.data.length !== 0
            && <div css={css`flex: 3;`}><ProjectedScheduleTable editable={editable} projectedSchedule={projectedSchedule}/>
            </div>}
            <div>
              <ProjectedScheduleChart scheduleChartData={scheduleChartData} width={400} height={400}/>
            </div>
          </div>
          <h3 css={css`font-size: 18px; margin-top: 33px;`}>Prescription for upcoming intervals</h3>
          {Object.entries(finalPrescription).map(([id, prescription]) => <PrescribedQuantitiesForDrug
            key={`PrescribedQuantitiesFor${id}`} id={parseFloat(id)} prescription={prescription} editable={editable}/>)}

          <div>
            <h3 css={css`margin-top: 40px;`}>Notes for Patient</h3>
            <TextArea
              value={instructionsForPatient}
              defaultValue={instructionsForPatient}
              onChange={onChangeMessageForPatient}
              placeholder={instructionsForPatientPlaceholder.current}
              rows={6}
              readOnly={!editable}
            />
            {!editable && <CopyToClipboard text={instructionsForPatient} onCopy={onInstructionsForPatientCopied}>
              <Button>Copy to Clipboard</Button>
            </CopyToClipboard>}
          </div>

          <div>
            <h3 css={css`margin-top: 40px;`}>Notes for Pharmacy</h3>
            <TextArea value={instructionsForPharmacy}
                      defaultValue={instructionsForPharmacy}
                      onChange={onChangeInstructionsForPharmacy}
                      rows={6}
                      readOnly={!editable}
            />
            {!editable && <CopyToClipboard text={instructionsForPharmacy} onCopy={onInstructionsForPharmacyCopied}>
              <Button>Copy to Clipboard</Button>
            </CopyToClipboard>}
          </div>
        </> : <div>No schedule yet</div>
      }
    </>
  );
};

export default ProjectedSchedule;
