import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GridApi } from 'ag-grid-community';
import {
  createContext, FC, useCallback, useRef, useState,
} from 'react';
import { Button } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { CopyToClipboard } from 'react-copy-to-clipboard';
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

interface IProjectedScheduleContext {
  gridApi: GridApi | null;
}

export const ProjectedScheduleContext = createContext<IProjectedScheduleContext>({
  gridApi: null,
});

const ProjectedSchedule: FC<{ editable: boolean }> = ({ editable }) => {
  const {
    projectedSchedule, scheduleChartData, finalPrescription, instructionsForPharmacy, instructionsForPatient,
  } = useSelector<RootState, TaperConfigState>((state) => state.taperConfig);
  const dispatch = useDispatch();
  const [gridApi, setGridApi] = useState<GridApi|null>(null);

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
    <ProjectedScheduleContext.Provider value={{ gridApi }}>
      {projectedSchedule.data.length
        ? <>
          <h3>Projected Schedule</h3>
          <div>Based on the current rate of reduction we project the following tapering schedule.</div>
          <div style={{ display: 'flex' }}>
            {projectedSchedule.data.length !== 0 && <div style={{ flex: 3 }}><ProjectedScheduleTable editable={editable} setGridApi={setGridApi}/></div>}
            <div style={{ flex: 2 }}>
              <ProjectedScheduleChart scheduleChartData={scheduleChartData} width={400} height={400}/>
            </div>
          </div>
          <hr/>
          <h3>Prescription for upcoming intervals</h3>
          {Object.entries(finalPrescription).map(([id, prescription]) => <PrescribedQuantitiesForDrug key={`PrescribedQuantitiesFor${id}`} id={parseFloat(id)} prescription={prescription}/>)}
          <h3>Instructions for Patient</h3>
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

          <h3>Instructions for Pharmacy</h3>
          <TextArea value={instructionsForPharmacy}
                    defaultValue={instructionsForPharmacy}
                    onChange={onChangeInstructionsForPharmacy}
                    rows={6}
                    readOnly={!editable}
          />
          {!editable && <CopyToClipboard text={instructionsForPharmacy} onCopy={onInstructionsForPharmacyCopied}>
            <Button>Copy to Clipboard</Button>
          </CopyToClipboard>}
        </> : <div>No schedule yet</div>
      }
    </ProjectedScheduleContext.Provider>
  );
};

export default ProjectedSchedule;
