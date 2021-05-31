import * as React from 'react';
import {
  Key, useCallback, useMemo, useRef, useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format, isAfter } from 'date-fns';
import { AgGridReact } from 'ag-grid-react';
import {
  CellEditingStartedEvent, CellEditingStoppedEvent,
  CellValueChangedEvent,
  ColDef, ColumnApi,
  FirstDataRenderedEvent, GridApi,
  GridReadyEvent,
  RowSelectedEvent,
  SelectionChangedEvent,
  ValueFormatterParams,
  ValueGetterParams, ValueSetterParams,
} from 'ag-grid-community';
import { RootState } from '../../redux/reducers';
import { TaperConfigState } from '../../redux/reducers/taperConfig';
import {
  SCHEDULE_ROW_SELECTED,
  ScheduleRowSelectedAction, TABLE_DOSAGE_EDITED, TABLE_END_DATE_EDITED,
  TABLE_START_DATE_EDITED, TableDosageEditedAction, TableEndDateEditedAction, TableStartDateEditedAction,
} from '../../redux/actions/taperConfig';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import './tableStyles.css';
import DateEditor from './DateEditor';

const ProjectedScheduleTable = () => {
  const [gridApi, setGridApi] = useState<GridApi|null>(null);
  const [gridColumnApi, setGridColumnApi] = useState<ColumnApi|null>(null);
  const {
    projectedSchedule,
  } = useSelector<RootState, TaperConfigState>((state) => state.taperConfig);
  const dispatch = useDispatch();

  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  const defaultColumnDef = useRef<ColDef>({
    resizable: true,
  });

  const columnDefs: ColDef[] = useMemo(() => {
    return [{
      headerName: 'Drug',
      field: 'drug',
      sortable: true,
      unSortIcon: true,
      checkboxSelection: true,
    }, {
      headerName: 'Dosage',
      field: 'dosage',
      editable: true,
      valueSetter: (params: ValueSetterParams) => params.newValue,
      valueFormatter: (params: ValueFormatterParams) => `${params.value}mg`,
    }, {
      headName: 'Start Date',
      field: 'startDate',
      sortable: true,
      unSortIcon: true,
      editable: true,
      cellEditor: 'datePicker',
      minWidth: 160,
      valueSetter: (params: ValueSetterParams) => params.newValue,
      valueFormatter: (params: ValueFormatterParams) => format(params.value, 'MM/dd/yyyy'),
    }, {
      headName: 'End Date',
      field: 'endDate',
      sortable: true,
      unSortIcon: true,
      editable: true,
      cellEditor: 'datePicker',
      minWidth: 160,
      valueSetter: (params: ValueSetterParams) => params.newValue,
      valueFormatter: (params: ValueFormatterParams) => format(params.value, 'MM/dd/yyyy'),
    }, {
      headerName: 'Prescription',
      field: 'prescription',
      editable: true,
    }];
  }, []);

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

  const onFirstDataRendered = (params: FirstDataRenderedEvent) => {
    params.api.sizeColumnsToFit();
    gridColumnApi?.autoSizeAllColumns();
  };

  const onCellEditingStopped = (params: CellEditingStoppedEvent) => {
    console.log('cell value editing stopped: ', params);
    switch (params.colDef.field) {
      case 'startDate': {
        const tempValue = new Date(params.newValue);
        const newValue = new Date(tempValue.valueOf() + tempValue.getTimezoneOffset() * 60 * 1000);
        dispatch<TableStartDateEditedAction>({
          type: TABLE_START_DATE_EDITED,
          data: { ...params, newValue },
        });
        break;
      }

      case 'endDate': {
        const tempValue = new Date(params.newValue);
        const newValue = new Date(tempValue.valueOf() + tempValue.getTimezoneOffset() * 60 * 1000);
        dispatch<TableEndDateEditedAction>({
          type: TABLE_END_DATE_EDITED,
          data: { ...params, newValue },
        });
        break;
      }

      case 'dosage':
        dispatch<TableDosageEditedAction>({
          type: TABLE_DOSAGE_EDITED,
          data: params,
        });
        break;
      default:
        console.error('No such field in the table');
    }
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'row', height: '500px', width: '100%',
    }}>
      <div className='ag-theme-alpine'
           style={{
             width: '100%',
             flexGrow: 1,
             overflow: 'hidden',
           }}>
        <AgGridReact
          rowData={projectedSchedule.data}
          defaultColDef={defaultColumnDef.current}
          columnDefs={columnDefs}
          rowSelection='multiple'
          onRowSelected={onRowSelected}
          onSelectionChanged={onSelectionChanged}
          onFirstDataRendered={onFirstDataRendered}
          onGridReady={onGridReady}
          onCellEditingStopped={onCellEditingStopped}
          frameworkComponents={{ datePicker: DateEditor }}
        />
      </div>
    </div>
  );
};

export default ProjectedScheduleTable;
