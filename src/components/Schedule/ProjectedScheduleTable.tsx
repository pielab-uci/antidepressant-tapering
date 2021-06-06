import * as React from 'react';
import {
  FC, useContext,
  useEffect,
  useMemo, useRef, useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import { AgGridReact } from 'ag-grid-react';
import {
  CellEditingStoppedEvent,
  ColDef, ColumnApi,
  FirstDataRenderedEvent, GridApi,
  GridReadyEvent, RowDataChangedEvent,
  RowSelectedEvent,
  SelectionChangedEvent,
  ValueFormatterParams,
  ValueSetterParams,
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
import NumberEditor from './NumberEditor';

const ProjectedScheduleTable: FC<{ setGridApi: (gridApi: GridApi) => void }> = ({ setGridApi }) => {
  // const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [gridColumnApi, setGridColumnApi] = useState<ColumnApi | null>(null);
  const {
    projectedSchedule, tableSelectedRows,
  } = useSelector<RootState, TaperConfigState>((state) => state.taperConfig);
  const dispatch = useDispatch();

  const onGridReady = (params: GridReadyEvent) => {
    console.log('onGridReady');
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    const selectedRows = projectedSchedule.data.reduce((res, row, i) => {
      if (row.selected) {
        res.push(i);
      }
      return res;
    }, [] as number[]);
    params.api.forEachNode((row) => {
      if (selectedRows.includes(row.rowIndex!)) {
        row.setSelected(true);
      }
    });
  };

  const defaultColumnDef = useRef<ColDef>({
    resizable: true,
    suppressMovable: true,
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
      cellEditor: 'numberEditor',
      valueFormatter: (params: ValueFormatterParams) => `${params.value}mg`,
      // need to keep below valueSetter
      valueSetter: (params: ValueSetterParams) => params.newValue,
      // valueSetter: valueSetter((x: string) => parseFloat(x) >= 0),
    }, {
      headName: 'Start Date',
      field: 'startDate',
      sortable: true,
      unSortIcon: true,
      editable: true,
      cellEditor: 'datePicker',
      minWidth: 160,
      valueFormatter: (params: ValueFormatterParams) => {
        return params.value !== null ? format(params.value, 'MM/dd/yyyy') : '';
      },
      // need to keep below valueSetter
      valueSetter: (params: ValueSetterParams) => params.newValue,
    }, {
      headName: 'End Date',
      field: 'endDate',
      sortable: true,
      unSortIcon: true,
      editable: true,
      cellEditor: 'datePicker',
      minWidth: 160,
      valueFormatter: (params: ValueFormatterParams) => {
        return params.value !== null ? format(params.value, 'MM/dd/yyyy') : '';
      },
      // need to keep below valueSetter
      valueSetter: (params: ValueSetterParams) => params.newValue,
    }, {
      headerName: 'Prescription',
      field: 'prescription',
      editable: true,
    }];
  }, []);

  const rowClassRules = useRef({
    Fluoxetine: (params: any) => params.data.drug === 'Fluoxetine',
    Citalopram: (params: any) => params.data.drug === 'Citalopram',
    Sertraline: (params: any) => params.data.drug === 'Sertraline',
    Paroxetine: (params: any) => params.data.drug === 'Paroxetine',
    Escitalopram: (params: any) => params.data.drug === 'Escitalopram',
  });

  const onRowSelected = (e: RowSelectedEvent) => {
    console.log(e);
  };

  const onSelectionChanged = (e: SelectionChangedEvent) => {
    const selectedNodes = e.api.getSelectedNodes().map((row) => row.rowIndex);
    dispatch<ScheduleRowSelectedAction>({ type: SCHEDULE_ROW_SELECTED, data: selectedNodes });
  };

  const onRowDataChanged = (e: RowDataChangedEvent) => {
    e.api.forEachNode((row) => {
      if (tableSelectedRows.includes(row.rowIndex)) {
        row.setSelected(true);
      }
    });
  };

  const onFirstDataRendered = (params: FirstDataRenderedEvent) => {
    params.api.sizeColumnsToFit();
    gridColumnApi?.autoSizeAllColumns();
  };

  const onCellEditingStopped = (params: CellEditingStoppedEvent) => {
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
    <div className='ProjectedScheduleTable' style={{
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
          rowClassRules={rowClassRules.current}
          onRowSelected={onRowSelected}
          onRowDataChanged={onRowDataChanged}
          onSelectionChanged={onSelectionChanged}
          onFirstDataRendered={onFirstDataRendered}
          onGridReady={onGridReady}
          onCellEditingStopped={onCellEditingStopped}
          frameworkComponents={{ datePicker: DateEditor, numberEditor: NumberEditor }}
          suppressDragLeaveHidesColumns={true}
        />
      </div>
    </div>
  );
};

export default ProjectedScheduleTable;
