import * as React from 'react';
import Modal from 'antd/es/modal';
import {
  FC, useCallback, useEffect, useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { css } from '@emotion/react';
import { GridApi, RowDoubleClickedEvent } from 'ag-grid-community';
import PrescriptionSettingsForm from '../PrescriptionForm/PrescriptionSettingsForm';
import {
  DrugForm, DrugOption, PrescribedDrug, TableRowData,
} from '../../types';
import { RootState } from '../../redux/reducers';
import { TaperConfigState } from '../../redux/reducers/taperConfig';
import PrescriptionForm from '../PrescriptionForm/PrescriptionForm';
import { ADD_NEW_DRUG_FORM, REMOVE_DRUG_FORM } from '../../redux/actions/taperConfig';

interface Props {
  visible: boolean;
  doubleClickedRowAndBefore: [TableRowData, TableRowData];
  onCancel: (e: React.MouseEvent<HTMLElement>) => void;
  onOk: (e: React.MouseEvent<HTMLElement>) => void;
}

const ProjectedScheduleTableRowEditingModal: FC<Props> = ({
  doubleClickedRowAndBefore, visible, onCancel, onOk,
}) => {
  const {
    drugs,
    lastPrescriptionFormId,
    projectedSchedule,
  } = useSelector<RootState, TaperConfigState>((state) => state.taperConfig);
  const [drugFromRow, setDrugFromRow] = useState<PrescribedDrug | null>(null);
  const dispatch = useDispatch();

  const prescriptionToDosages = useCallback((row: TableRowData): { dosage: string, quantity: number }[] => {
    if (row.prescription === null) {
      return [];
    }

    if (row.form === 'capsule' || row.form === 'tablet') {
      const dosages = row.prescribedDrug.regularDosageOptions!.map((option) => ({ dosage: option, quantity: 0 }));

      Object.entries(row.prescription.data.dosage).forEach(([dosage, quantity]) => {
        dosages.find((dos) => dos.dosage === dosage)!.quantity = quantity;
      });
      return dosages;
    }

    return [{ dosage: '1mg', quantity: row.prescription.data.dosage['1mg'] }];
  }, []);

  useEffect(() => {
    const [prevRow, doubleClickedRow] = doubleClickedRowAndBefore;
    console.log('prevRow: ', prevRow);
    console.log('doubleClickedRow: ', doubleClickedRow);
    const priorDosageSum = (prevRow.prescription && Object.entries(prevRow.prescription.data.dosage).reduce((prev, [dosage, qty]) => {
      return prev + parseFloat(dosage) * qty;
    }, 0)) || 0;

    const upcomingDosageSum = (doubleClickedRow.prescription && Object.entries(doubleClickedRow.prescription?.data.dosage).reduce((prev, [dosage, qty]) => {
      return prev + parseFloat(dosage) * qty;
    }, 0)) || 0;

    setDrugFromRow({
      ...doubleClickedRow.prescribedDrug,
      id: lastPrescriptionFormId + 1,
      allowChangePriorDosage: false,
      intervalStartDate: doubleClickedRow.startDate!,
      intervalEndDate: doubleClickedRow.endDate,
      intervalUnit: doubleClickedRow.intervalUnit!,
      intervalCount: doubleClickedRow.intervalCount,
      priorDosages: prescriptionToDosages(prevRow),
      upcomingDosages: prescriptionToDosages(doubleClickedRow),
      priorDosageSum,
      upcomingDosageSum,
      targetDosage: upcomingDosageSum,
    });

    dispatch({
      type: ADD_NEW_DRUG_FORM,
      data: drugFromRow,
    });
  }, []);

  // const prescriptionToDosages = (prescription: TableRowData['prescription']): { dosage: string, quantity: number }[] => {

  const onClickOk = (e: React.MouseEvent<HTMLElement>) => {
    onOk(e);
    // TODO: update table rows
  };

  const onClickCancel = (e: React.MouseEvent<HTMLElement>) => {
    onCancel(e);
    dispatch({
      type: REMOVE_DRUG_FORM,
      data: drugFromRow!.id,
    });
  };

  return <Modal visible={visible} onCancel={onClickCancel} onOk={onClickOk} width={'50%'}
                css={css`height: 85%;
                  overflow-y: scroll;`}>
    {drugFromRow && <PrescriptionForm prescribedDrug={drugFromRow} title={''}/>}
  </Modal>;
};

export default ProjectedScheduleTableRowEditingModal;
