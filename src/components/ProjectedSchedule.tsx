import * as React from 'react';
import { useSelector } from 'react-redux';
import ProjectedScheduleTable, { TableRow } from './ProjectedScheduleTable';
import ScheduleChart from './ScheduleChart';
import { RootState } from '../redux/reducers';
import { TaperConfigState } from '../redux/reducers/taperConfig';
import { TableRowData } from '../redux/reducers/utils';

export interface Schedule {
  drugs: string[];
  data: TableRowData[];
}

const ProjectedSchedule = () => {
  const { projectedSchedule } = useSelector<RootState, TaperConfigState>((state) => state.taperConfig);

  return (
    <>
      { projectedSchedule.data.length
        ? <>
      <h3>Projected Schedule</h3>
      <div>Based on the current rate of reduction we project the following tapering schedule.</div>
      <div style={{ display: 'flex' }}>
        {projectedSchedule.data.length !== 0 && <div style={{ flex: 3 }}><ProjectedScheduleTable /></div>}
        <div style={{ flex: 2 }}>
          <ScheduleChart />
        </div>
      </div>
        </> : <div>No schedule yet</div>
      }
    </>
  );
};

export default ProjectedSchedule;
