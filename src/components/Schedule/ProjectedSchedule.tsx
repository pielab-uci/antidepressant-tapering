import * as React from 'react';
import { useSelector } from 'react-redux';
import { GridApi } from 'ag-grid-community';
import { createContext, useState } from 'react';
import ProjectedScheduleTable from './ProjectedScheduleTable';
import ScheduleChart from './ScheduleChart';
import { RootState } from '../../redux/reducers';
import { TaperConfigState } from '../../redux/reducers/taperConfig';
import { PrescribedDrug, TableRowData } from '../../types';
import PrescribedQuantitiesForDrug from './PrescribedQuantitiesForDrug';

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

const ProjectedSchedule = () => {
  const { projectedSchedule, scheduleChartData, finalPrescription } = useSelector<RootState, TaperConfigState>((state) => state.taperConfig);
  const [gridApi, setGridApi] = useState<GridApi|null>(null);
  return (
    <ProjectedScheduleContext.Provider value={{ gridApi }}>
      {projectedSchedule.data.length
        ? <>
          <h3>Projected Schedule</h3>
          <div>Based on the current rate of reduction we project the following tapering schedule.</div>
          <div style={{ display: 'flex' }}>
            {projectedSchedule.data.length !== 0 && <div style={{ flex: 3 }}><ProjectedScheduleTable setGridApi={setGridApi}/></div>}
            <div style={{ flex: 2 }}>
              <ScheduleChart scheduleChartData={scheduleChartData} width={400} height={400}/>
            </div>
          </div>
          <hr/>
          <h3>Prescription for upcoming intervals</h3>
          {Object.entries(finalPrescription).map(([id, prescription]) => <PrescribedQuantitiesForDrug key={`PrescribedQuantitiesFor${id}`} prescription={prescription}/>)}
        </> : <div>No schedule yet</div>
      }
    </ProjectedScheduleContext.Provider>
  );
};

export default ProjectedSchedule;
