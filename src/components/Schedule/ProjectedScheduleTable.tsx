import * as React from 'react';
import {
  FC, useContext,
  useRef, useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AgGridReact } from 'ag-grid-react';
import {
  CheckboxSelectionCallbackParams,
  ColDef, ColumnApi,
  FirstDataRenderedEvent,
  GridReadyEvent, RowDataChangedEvent, RowDoubleClickedEvent,
  RowSelectedEvent,
  SelectionChangedEvent, ValueFormatterParams, ValueSetterParams,
} from 'ag-grid-community';
import format from 'date-fns/esm/format';
import { Simulate } from 'react-dom/test-utils';
import { RootState } from '../../redux/reducers';
import { TaperConfigState } from '../../redux/reducers/taperConfig';
import {
  OPEN_MODAL_FOR_EDITING_TABLE_ROW,
  SCHEDULE_ROW_SELECTED,
  ScheduleRowSelectedAction,
} from '../../redux/actions/taperConfig';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import './tableStyles.css';
import DateEditor from './DateEditor';
import NumberEditor from './NumberEditor';
import { Schedule } from './ProjectedSchedule';
import ProjectedScheduleTableRowEditingModal from './ProjectedScheduleTableRowEditingModal';
import { PrescribedDrug, TableRowData } from '../../types';

const ProjectedScheduleTable: FC<{ editable: boolean, projectedSchedule: Schedule }> = ({
  editable,
  projectedSchedule,
}) => {
  const {
    tableSelectedRows, lastPrescriptionFormId,
  } = useSelector<RootState, TaperConfigState>((state) => state.taperConfig);
  const dispatch = useDispatch();
  const [gridColumnApi, setGridColumnApi] = useState<ColumnApi | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [doubleClickedRow, setDoubleClickedRow] = useState<TableRowData | null>(null);

  const onGridReady = (params: GridReadyEvent) => {
    console.log('onGridReady');
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

  const columnDefs = useRef<ColDef[]>(
    [{
      headerName: '',
      field: 'prescribe',
      hide: !editable,
      checkboxSelection: (params: CheckboxSelectionCallbackParams) => !params.data.isPriorDosage && editable,
    },
    {
      headerName: 'Medication',
      // field: 'drug',
      field: 'brand',
      sortable: true,
      unSortIcon: true,
    }, {
      headerName: 'Dosage',
      field: 'dosage',
      // editable: (params: EditableCallbackParams) => editable && !params.data.isPriorDosage,
      cellEditor: 'numberEditor',
      valueFormatter: (params: ValueFormatterParams) => `${params.value}mg`,
      // need to keep below valueSetter
      valueSetter: (params: ValueSetterParams) => params.newValue,
      // valueSetter: valueSetter((x: string) => parseFloat(x) >= 0),
    }, {
      headerName: 'Start Date',
      field: 'startDate',
      sortable: true,
      unSortIcon: true,
      // editable: (params: EditableCallbackParams) => editable && !params.data.isPriorDosage,
      cellEditor: 'datePicker',
      minWidth: 160,
      valueFormatter: (params: ValueFormatterParams) => {
        return params.value !== null ? format(params.value, 'MM/dd/yyyy') : '';
      },
      // need to keep below valueSetter
      valueSetter: (params: ValueSetterParams) => params.newValue,
    }, {
      headerName: 'End Date',
      field: 'endDate',
      sortable: true,
      unSortIcon: true,
      // editable: (params: EditableCallbackParams) => editable && !params.data.isPriorDosage,
      cellEditor: 'datePicker',
      minWidth: 160,
      valueFormatter: (params: ValueFormatterParams) => {
        return params.value !== null ? format(params.value, 'MM/dd/yyyy') : '';
      },
      // need to keep below valueSetter
      valueSetter: (params: ValueSetterParams) => params.newValue,
    }, {
      headerName: 'Prescription',
      field: 'prescription.message',
      // editable: (params: EditableCallbackParams) => editable && !params.data.isPriorDosage,
    }],
  );

  const rowClassRules = useRef({
    PriorDosage: (params: any) => params.data.isPriorDosage,
    Fluoxetine: (params: any) => !params.data.isPriorDosage && params.data.drug === 'Fluoxetine',
    Citalopram: (params: any) => !params.data.isPriorDosage && params.data.drug === 'Citalopram',
    Sertraline: (params: any) => !params.data.isPriorDosage && params.data.drug === 'Sertraline',
    Paroxetine: (params: any) => !params.data.isPriorDosage && params.data.drug === 'Paroxetine',
    Escitalopram: (params: any) => !params.data.isPriorDosage && params.data.drug === 'Escitalopram',
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

  const openModal = (event: RowDoubleClickedEvent) => {
    console.group('openModal');
    console.log('event: ', event);
    console.groupEnd();
    const newPrescribedDrug: PrescribedDrug = {
      ...event.data.prescribedDrug,
      id: lastPrescriptionFormId + 1,

    };
    if (event.rowIndex !== 0) {
      const rowWithNewDrug: TableRowData = {
        ...event.data,
        prescribedDrug: {
          ...event.data.prescribedDrug,
          // id:
        },
      };
      setDoubleClickedRow(event.data);
      setShowModal(true);
      dispatch({
        type: OPEN_MODAL_FOR_EDITING_TABLE_ROW,
        data: [event.api.getRowNode(`${parseFloat(event.node.id!) - 1}`)?.data, event.data],
      });
    }
  };

  const handleModalCancel = () => {
    setShowModal(false);
    setDoubleClickedRow(null);
  };

  const handleModalOk = () => {
    setShowModal(false);
    setDoubleClickedRow(null);
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
          columnDefs={columnDefs.current}
          rowSelection='multiple'
          rowClassRules={rowClassRules.current}
          onRowSelected={onRowSelected}
          onRowDoubleClicked={editable ? openModal : undefined}
          onRowDataChanged={onRowDataChanged}
          onSelectionChanged={onSelectionChanged}
          onFirstDataRendered={onFirstDataRendered}
          onGridReady={onGridReady}
          // onCellEditingStopped={onCellEditingStopped}
          frameworkComponents={{ datePicker: DateEditor, numberEditor: NumberEditor }}
          suppressDragLeaveHidesColumns={true}
          suppressRowClickSelection={true}
        />
        {/* TODO: refactor - only to use doubleClickedRow..? */}
        {showModal && <ProjectedScheduleTableRowEditingModal
          row={doubleClickedRow}
          visible={showModal}
          onCancel={handleModalCancel}
          onOk={handleModalOk}/>}
      </div>
    </div>
  );
};

export default ProjectedScheduleTable;
