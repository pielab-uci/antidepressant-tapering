import * as React from 'react';
import { useSelector } from 'react-redux';
import ProjectedScheduleTable, { TableRow } from './ProjectedScheduleTable';
import ScheduleChart from './ScheduleChart';
import { RootState } from '../redux/reducers';
import { TaperConfigState } from '../redux/reducers/taperConfig';

export interface Schedule {
  startDates: { [drug: string]: Date },
  endDates: { [drug: string]: Date },
  drugs: string[];
  data: (TableRow & { startDate: Date, endDate: Date })[];
}

const ProjectedSchedule = () => {
  const { projectedSchedule } = useSelector<RootState, TaperConfigState>((state) => state.taperConfig);

  return (
    <>
      <h3>Projected Schedule</h3>
      <div>Based on the current rate of reduction we project the following tapering schedule.</div>
      <div style={{ display: 'flex' }}>
        {projectedSchedule.data.length !== 0 && <div style={{ flex: 3 }}><ProjectedScheduleTable /></div>}
        <div style={{ flex: 2 }}>
          <ScheduleChart />
        </div>
      </div>
    </>
  );
};

export default ProjectedSchedule;
