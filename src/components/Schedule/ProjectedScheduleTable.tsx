import * as React from 'react';
import { Key, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table } from 'antd';
import { format, isAfter } from 'date-fns';
import { RootState } from '../../redux/reducers';
import { TaperConfigState } from '../../redux/reducers/taperConfig';
import { SCHEDULE_ROW_SELECTED, ScheduleRowSelectedAction } from '../../redux/actions/taperConfig';
import { TableRowData } from '../../redux/reducers/utils';

const ProjectedScheduleTable = () => {
  const columns = useMemo(() => [
    {
      title: 'Drug',
      dataIndex: 'drug',
      key: 'Drug',
      sorter: {
        compare: (a: TableRowData, b: TableRowData) => (a.drug > b.drug ? 1 : 0),
      },
    },
    {
      title: 'Dosage',
      dataIndex: 'dosage',
      key: 'Dosage',
      render: (dosage: number, row: TableRowData) => `${dosage}${row.measureUnit}`,
    },
    {
      title: 'Start date',
      dataIndex: 'startDate',
      key: 'startDate',
      sorter: {
        compare: (a: TableRowData, b: TableRowData) => (isAfter(a.startDate, b.startDate) ? 1 : -1),
      },
      render: (date: Date) => format(date, 'MM/dd/yyyy'),
      editable: true,
    },
    {
      title: 'End date',
      dataIndex: 'endDate',
      key: 'endDate',
      sorter: {
        compare: (a: TableRowData, b: TableRowData) => (isAfter(a.endDate, b.endDate) ? 1 : -1),
      },
      render: (date: Date) => format(date, 'MM/dd/yyyy'),
    },
    { title: 'Prescription', dataIndex: 'prescription', key: 'Prescription' },
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
