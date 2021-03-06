import * as React from 'react';
import {
  FC, useCallback, useRef, useState,
} from 'react';
import { useState as useStateLog } from 'reinspect';

import { useDispatch, useSelector } from 'react-redux';
import { AgGridReact } from 'ag-grid-react';
import {
  CheckboxSelectionCallbackParams,
  ColDef, ColumnApi,
  FirstDataRenderedEvent, GridApi,
  GridReadyEvent, RowDataChangedEvent, RowDoubleClickedEvent,
  RowSelectedEvent,
  SelectionChangedEvent, ValueFormatterParams, ValueSetterParams,
} from 'ag-grid-community';
import format from 'date-fns/esm/format';
import { css } from '@emotion/react';
import { RootState } from '../../redux/reducers';
import { TaperConfigState } from '../../redux/reducers/taperConfig';
import {
  ADD_NEW_DRUG_FORM, OPEN_MODAL, OpenModalAction,
  SCHEDULE_ROW_SELECTED,
  ScheduleRowSelectedAction,
} from '../../redux/actions/taperConfig';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import './tableStyles.css';
import DateEditor from './DateEditor';
import NumberEditor from './NumberEditor';
import { Schedule } from './ProjectedSchedule';
import ProjectedScheduleTableRowEditingModal from './Modal/ProjectedScheduleTableRowEditingModal';
import { PrescribedDrug, TableRowData } from '../../types';
import PrescriptionForm from '../PrescriptionForm/PrescriptionForm';

const ProjectedScheduleTable: FC<{ editable: boolean, projectedSchedule: Schedule }> = ({
  editable,
  projectedSchedule,
}) => {
  const {
    tableSelectedRows, lastPrescriptionFormId, prescribedDrugs,
  } = useSelector<RootState, TaperConfigState>((state) => state.taperConfig);
  const dispatch = useDispatch();
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [gridColumnApi, setGridColumnApi] = useState<ColumnApi | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [clickedRowAndBefore, setClickedRowAndBefore] = useState<[TableRowData, TableRowData] | null>(null);

  const onGridReady = (params: GridReadyEvent) => {
    console.log('onGridReady');
    setGridColumnApi(params.columnApi);
    setGridApi(params.api);
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
    // params.api.sizeColumnsToFit();
    // params.columnApi.autoSizeAllColumns();
  };

  const rowStyle = useRef<{ [p: string]: string | number }>({
    fontSize: '0.8rem',
  });

  const defaultColumnDef = useRef<ColDef>({
    resizable: true,
    suppressMovable: true,
  });

  const columnDefs = useRef<ColDef[]>(
    [{
      headerName: '',
      field: 'prescribe',
      hide: !editable,
      width: 10,
      checkboxSelection: (params: CheckboxSelectionCallbackParams) => !params.data.isPriorDosage && editable,
      cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
      suppressSizeToFit: false,
    },
    {
      headerName: 'Medication',
      // field: 'drug',
      field: 'brand',
      sortable: true,
      unSortIcon: true,
      minWidth: 80,
      cellStyle: { display: 'flex', justifyContent: 'flex-start', alignItems: 'center' },
    }, {
      headerName: 'Dosage',
      field: 'dosage',
      // editable: (params: EditableCallbackParams) => editable && !params.data.isPriorDosage,
      cellEditor: 'numberEditor',
      maxWidth: 100,
      valueFormatter: (params: ValueFormatterParams) => `${params.value} mg`,
      // need to keep below valueSetter
      valueSetter: (params: ValueSetterParams) => params.newValue,
      // valueSetter: valueSetter((x: string) => parseFloat(x) >= 0),
      cellStyle: { display: 'flex', justifyContent: 'flex-start', alignItems: 'center' },
    }, {
      headerName: 'Start Date',
      field: 'startDate',
      sortable: true,
      unSortIcon: true,
      // editable: (params: EditableCallbackParams) => editable && !params.data.isPriorDosage,
      // cellEditor: 'datePicker',
      minWidth: 150,
      maxWidth: 150,
      valueFormatter: (params: ValueFormatterParams) => {
        return params.value !== null ? format(params.value, 'MM/dd/yyyy') : '';
      },
      // need to keep below valueSetter
      valueSetter: (params: ValueSetterParams) => params.newValue,
      cellStyle: { display: 'flex', justifyContent: 'flex-start', alignItems: 'center' },
      suppressSizeToFit: false,
    }, {
      headerName: 'End Date',
      field: 'endDate',
      sortable: true,
      unSortIcon: true,
      // editable: (params: EditableCallbackParams) => editable && !params.data.isPriorDosage,
      // cellEditor: 'datePicker',

      minWidth: 150,
      maxWidth: 150,
      valueFormatter: (params: ValueFormatterParams) => {
        return params.value !== null ? format(params.value, 'MM/dd/yyyy') : '';
      },
      // need to keep below valueSetter
      valueSetter: (params: ValueSetterParams) => params.newValue,
      cellStyle: { display: 'flex', justifyContent: 'flex-start', alignItems: 'center' },
      suppressSizeToFit: false,
    }, {
      headerName: 'Prescription',
      field: 'prescription.message',
      suppressSizeToFit: false,
      minWidth: 700,
      cellStyle: { display: 'flex', justifyContent: 'flex-start', alignItems: 'center' },
      flex: 1,
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
    // console.log('allColumns: ', params.columnApi.getAllColumns());
    params.columnApi.autoSizeColumns(['brand', 'startDate', 'endDate']);
    // , 'prescription.message']);
  };

  const openModal = (event: RowDoubleClickedEvent) => {
    console.group('openModal');
    console.log('event: ', event);
    // if (event.rowIndex !== 0) {
    if (event.data.rowIndexInPrescribedDrug !== -1) {
      console.log('setDoubleClickedRowAndBefore');
      const prevAndDoubleClickedRow: [TableRowData, TableRowData] = [] as unknown as [TableRowData, TableRowData];

      event.api.forEachNode((row, i) => {
        if (row.data.prescribedDrugId === event.data.prescribedDrugId
          && row.data.rowIndexInPrescribedDrug === event.data.rowIndexInPrescribedDrug - 1) {
          prevAndDoubleClickedRow[0] = row.data;
          prevAndDoubleClickedRow[1] = event.data;
        }
        return null;
      });
      console.log('prevAndDoubleClickedRow: ', prevAndDoubleClickedRow);
      setClickedRowAndBefore(prevAndDoubleClickedRow);
      // not changed yet..
      console.log('doubleClickedRowAndBefore: ', clickedRowAndBefore);
      setShowModal(true);
      // dispatch({
      //   type: OPEN_MODAL_FOR_EDITING_TABLE_ROW,
      //   data: [event.api.getRowNode(`${parseFloat(event.node.id!) - 1}`)?.data, event.data],
      // });
    }
    console.groupEnd();
  };

  const handleModalCancel = () => {
    setShowModal(false);
    // setDrugFromDoubleClickedRow(null);
  };

  const handleModalOk = () => {
    setShowModal(false);
    // setDrugFromDoubleClickedRow(null);
  };

  return (
    <div className='ProjectedScheduleTable' css={css`
      display: flex;
      flex-direction: row;
      height: 300px;
      width: 100%;`}>
      <div className='ag-theme-alpine'
           css={css`
             width: 100%;
             flex-grow: 1;
             overflow: hidden;

             .ag-header-cell-label {
               //justify-content: center !important;
             }

             .ag-header-cell-text {
               font-size: 0.8rem;
             }

             div[col-id='prescribe'] {
               width: 10px;
               padding: 0;
               margin: auto;
               justify-content: center;
             }

             .ag-selection-checkbox {
               margin: 0 !important;
             }
           `}>
        <AgGridReact
          rowData={projectedSchedule.data}
          defaultColDef={defaultColumnDef.current}
          columnDefs={columnDefs.current}
          rowSelection='multiple'
          rowClassRules={rowClassRules.current}
          rowHeight={35}
          rowStyle={rowStyle.current}
          // onRowDoubleClicked={editable ? openModal : undefined}
          onRowClicked={editable ? openModal : undefined}
          onRowDataChanged={onRowDataChanged}
          onSelectionChanged={onSelectionChanged}
          onFirstDataRendered={onFirstDataRendered}
          onGridReady={onGridReady}
          // onCellEditingStopped={onCellEditingStopped}
          frameworkComponents={{ datePicker: DateEditor, numberEditor: NumberEditor }}
          suppressDragLeaveHidesColumns={true}
          suppressScrollOnNewData={true}
          suppressRowClickSelection={true}
          skipHeaderOnAutoSize={true}
        />
        {clickedRowAndBefore
        && showModal
        && <ProjectedScheduleTableRowEditingModal
          clickedRowAndBefore={clickedRowAndBefore}
          visible={showModal} onCancel={handleModalCancel}
          onOk={handleModalOk}/>}
      </div>
    </div>
  );
};

export default ProjectedScheduleTable;
