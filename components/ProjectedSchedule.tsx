import * as React from 'react';
import ProjectedScheduleTable from "./ProjectedScheduleTable";
import ScheduleChart from "./ScheduleChart";
import {useSelector} from "react-redux";
import {RootState} from "../redux/reducers";
import {TaperConfigState} from '../redux/reducers/taperConfig';

const ProjectedSchedule = () => {
  const {scheduleTableData} = useSelector<RootState, TaperConfigState>(state => state.taperConfig);

  return (
    <>
      <h3>Projected Schedule</h3>
      <div>Based on the current rate of reduction we project the following tapering schedule.</div>
      {scheduleTableData.length !== 0 && <ProjectedScheduleTable/>}
      <ScheduleChart/>
    </>
  )
}

export default ProjectedSchedule;
