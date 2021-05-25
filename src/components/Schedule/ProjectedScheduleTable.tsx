import * as React from 'react';
import { Key, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table } from 'antd';
import { RootState } from '../../redux/reducers';
import { TaperConfigState } from '../../redux/reducers/taperConfig';
import { SCHEDULE_ROW_SELECTED, ScheduleRowSelectedAction } from '../../redux/actions/taperConfig';

export interface TableRow {
  Drug: string;
  Dosage: string;
  Dates: string;
  Prescription: string;
}

const ProjectedScheduleTable = () => {
  const columns = useMemo(() => [
    { title: 'Drug', dataIndex: 'Drug', key: 'Drug' },
    { title: 'Dosage', dataIndex: 'Dosage', key: 'Dosage' },
    { title: 'Dates', dataIndex: 'Dates', key: 'Dates' },
    { title: 'Prescription', dataIndex: 'Prescription', key: 'Prescription' },
  ], []);

  const {
    projectedSchedule,
    scheduleSelectedRowKeys,
  } = useSelector<RootState, TaperConfigState>((state) => state.taperConfig);
  const dispatch = useDispatch();
  const rowSelectionOnChange = useCallback((selectedRowKeys: Key[]) => {
    dispatch<ScheduleRowSelectedAction>({ type: SCHEDULE_ROW_SELECTED, data: selectedRowKeys });
  }, []);

  return (
    <Table columns={columns}
           dataSource={projectedSchedule.data.map((d, i) => ({ ...d, key: i }))}
           rowSelection={{ selectedRowKeys: scheduleSelectedRowKeys, onChange: rowSelectionOnChange }}
    />
  );
};

export default ProjectedScheduleTable;
