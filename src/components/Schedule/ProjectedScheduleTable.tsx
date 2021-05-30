import * as React from 'react';
import { Key, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format, isAfter } from 'date-fns';
import { AgGridReact } from 'ag-grid-react';
import {
  ColDef, RowSelectedEvent, SelectionChangedEvent, ValueFormatterParams, ValueGetterParams,
} from 'ag-grid-community';
import { RootState } from '../../redux/reducers';
import { TaperConfigState } from '../../redux/reducers/taperConfig';
import { SCHEDULE_ROW_SELECTED, ScheduleRowSelectedAction } from '../../redux/actions/taperConfig';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import './tableStyles.css';
import DatePicker from './DatePicker';

const ProjectedScheduleTable = () => {
  const columnDefs: ColDef[] = useMemo(() => {
    return [{
      headerName: 'Drug',
      field: 'drug',
      sortable: true,
      resizable: true,
      unSortIcon: true,
      checkboxSelection: true,
      // filter: 'agTextColumnFilter',
    }, {
      headerName: 'Dosage',
      field: 'dosage',
      resizable: true,
      editable: true,
      valueFormatter: (params: ValueFormatterParams) => `${params.value}mg`,
    }, {
      headName: 'Start Date',
      field: 'startDate',
      sortable: true,
      unSortIcon: true,
      resizable: true,
      editable: true,
      cellEditor: 'datePicker',
      valueFormatter: (params: ValueFormatterParams) => format(params.value, 'MM/dd/yyyy'),
    }, {
      headName: 'End Date',
      field: 'endDate',
      sortable: true,
      unSortIcon: true,
      resizable: true,
      editable: true,
      cellEditor: 'datePicker',
      valueFormatter: (params: ValueFormatterParams) => format(params.value, 'MM/dd/yyyy'),
    }, {
      headerName: 'Prescription',
      field: 'prescription',
      resizable: true,
      editable: true,
    }];
  }, []);

  const {
    projectedSchedule,
  } = useSelector<RootState, TaperConfigState>((state) => state.taperConfig);
  const dispatch = useDispatch();
  // const rowSelectionOnChange = useCallback((selectedRowKeys: Key[]) => {
  //   dispatch<ScheduleRowSelectedAction>({ type: SCHEDULE_ROW_SELECTED, data: selectedRowKeys });
  // }, []);

  const onRowSelected = (e: RowSelectedEvent) => {
    console.log(e);
  };

  const onSelectionChanged = (e: SelectionChangedEvent) => {
    const selectedRowsIndices = e.api.getSelectedNodes()
      .map((node) => node.rowIndex);

    console.log('selectedRowIndices: ', selectedRowsIndices);
    dispatch<ScheduleRowSelectedAction>({ type: SCHEDULE_ROW_SELECTED, data: selectedRowsIndices });
  };

  return (
    <div className='ag-theme-alpine' style={{ flex: '1 auto', height: '500px', width: '100%' }}>
      <AgGridReact
        rowData={projectedSchedule.data}
        columnDefs={columnDefs}
        rowSelection='multiple'
        onRowSelected={onRowSelected}
        onSelectionChanged={onSelectionChanged}
        // frameworkComponents={{ datePicker_: DateEditor }}
        frameworkComponents={{ datePicker: DatePicker }}
        // components={{ datePicker_: DateEditor }}
      />
    </div>
  );
};

export default ProjectedScheduleTable;
