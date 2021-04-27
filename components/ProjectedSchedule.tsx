import * as React from 'react';
import ProjectedScheduleTable from "./ProjectedScheduleTable";
import ScheduleChart from "./ScheduleChart";
import {useForm} from "react-hook-form";
const ProjectedSchedule = () => {
  const { register, handleSubmit } = useForm();
  return (
    <>
      <h3>Projected Schedule</h3>
      <div>Based on the current rate of reduction we project the following tapering schedule.</div>
      <ProjectedScheduleTable />
      <ScheduleChart/>
      <form>

      </form>
    </>
  )
}

export default ProjectedSchedule;
