import * as React from 'react';
import Modal from 'antd/es/modal';
import {
  FC, useCallback, useEffect, useRef,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { css } from '@emotion/react';
import { GridApi, RowDoubleClickedEvent } from 'ag-grid-community';
import { useState } from 'reinspect';
import PrescriptionSettingsForm from '../PrescriptionForm/PrescriptionSettingsForm';
import {
  DrugForm, DrugOption, PrescribedDrug, TableRowData,
} from '../../types';
import { RootState } from '../../redux/reducers';
import { TaperConfigState } from '../../redux/reducers/taperConfig';
import PrescriptionForm from '../PrescriptionForm/PrescriptionForm';
import { ADD_NEW_DRUG_FORM, EDIT_PROJECTED_SCHEDULE_FROM_MODAL, REMOVE_DRUG_FORM } from '../../redux/actions/taperConfig';

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
    prescribedDrugs,
  } = useSelector<RootState, TaperConfigState>((state) => state.taperConfig);
  // const [drugFromRow, setDrugFromRow] = useState<PrescribedDrug | null>(null);
  const [drugFromRow, setDrugFromRow] = useState<PrescribedDrug | null>(null, 'DrugInModal');
  const dispatch = useDispatch();
  // const [prescribedDrugId, setPrescribedDrugId] = useState<number>(-1);
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

    const newDrugFromRow: PrescribedDrug = {
      ...doubleClickedRow.prescribedDrug,
      applyInSchedule: false,
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
    };

    setDrugFromRow(newDrugFromRow);

    dispatch({
      type: ADD_NEW_DRUG_FORM,
      data: newDrugFromRow,
    });
  }, []);

  // const prescriptionToDosages = (prescription: TableRowData['prescription']): { dosage: string, quantity: number }[] => {

  const onClickOk = (e: React.MouseEvent<HTMLElement>) => {
    /**
     * When medication is changed: add new medication with full new settings
     * When dosage is changed:
     *  - when dosage was increasing before -> increase the dosage of other table rows by the same amount
     *  - when dosage was decreasing before -> decrease the dosage of other table rows by new decreasing rate
     * When start/end date is changed:
     * - When start date is changed: only affect the double clicked row
     * - - When new start date is overlapped with previous rows with the same prescribed drug:
     * - When end date is changed: push the table rows with same prescribed drug back by the same interval unit count
     */

    onOk(e);
    dispatch({
      type: EDIT_PROJECTED_SCHEDULE_FROM_MODAL,
      data: { doubleClickedRowAndBefore, prescribedDrugGeneratedFromRow: drugFromRow },
    });
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
    {/* {prescribedDrugId !== -1 && <PrescriptionForm prescribedDrug={prescribedDrugs!.find((drug) => drug.id === prescribedDrugId)!} title={''}/>} */}
    {drugFromRow && <PrescriptionForm prescribedDrug={drugFromRow} isModal={true} title={''}/>}
  </Modal>;
};

export default ProjectedScheduleTableRowEditingModal;
