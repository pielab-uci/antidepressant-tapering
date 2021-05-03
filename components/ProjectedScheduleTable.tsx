import * as React from 'react';
import {useMemo} from 'react';
import {RootState} from "../redux/reducers";
import {useSelector} from "react-redux";
import {TaperConfigState} from "../redux/reducers/taperConfig";
import {Table} from "antd";

export interface TableRow {
  Drug: string;
  'Current Dosage': string;
  'Next Dosage': string;
  Dates: string;
}

const ProjectedScheduleTable = () => {
  const columns = useMemo(() => [
    { title: 'Drug', dataIndex: 'Drug', key: 'Drug'},
    { title: 'Current Dosage', dataIndex: 'Current Dosage', key: 'Current Dosage'},
    { title: 'Next Dosage', dataIndex: 'Next Dosage', key: 'Next Dosage'},
    { title: 'Dates', dataIndex: 'Dates', key: 'Dates'}
  ], [])

  const {projectedSchedule} = useSelector<RootState, TaperConfigState>(state => state.taperConfig);

  return (
    <Table columns={columns} dataSource={projectedSchedule.data.map((d, i) => ({...d, key: i}))}/>
  )
}

export default ProjectedScheduleTable;
