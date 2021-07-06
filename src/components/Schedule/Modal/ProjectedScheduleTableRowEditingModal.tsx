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
import produce from 'immer';
import PrescriptionSettingsForm from '../../PrescriptionForm/PrescriptionSettingsForm';
import {
  DrugForm, DrugOption, PrescribedDrug, TableRowData,
} from '../../../types';
import { RootState } from '../../../redux/reducers';
import { TaperConfigState } from '../../../redux/reducers/taperConfig/taperConfig';
import PrescriptionForm from '../../PrescriptionForm/PrescriptionForm';
import { ADD_NEW_DRUG_FORM, EDIT_PROJECTED_SCHEDULE_FROM_MODAL, REMOVE_DRUG_FORM } from '../../../redux/actions/taperConfig';
import { CHOOSE_BRAND, CHOOSE_FORM, PrescriptionFormActions } from '../../PrescriptionForm/actions';

interface RowEditingModalState {
  prescribedDrug: PrescribedDrug | null;
}

const initialState: RowEditingModalState = {
  prescribedDrug: null,
};

const reducer = (state: RowEditingModalState, action: PrescriptionFormActions): RowEditingModalState => {
  return produce(state, (draft) => {
    switch (action.type) {
      case CHOOSE_BRAND: {
        const drugs = ['Fluoxetine', 'Citalopram', 'Sertraline', 'Paroxetine', 'Escitalopram'];
        draft.prescribedDrug!.brand = action.data.brand;
        draft.prescribedDrug!.name = drugs.find((drug) => action.data.brand.includes(drug))!;
        break;
      }

      case CHOOSE_FORM:
    }
  });
};

interface Props {
  prescribedDrug: PrescribedDrug;
  visible: boolean;
  doubleClickedRowAndBefore: [TableRowData, TableRowData];
  onCancel: (e: React.MouseEvent<HTMLElement>) => void;
  onOk: (e: React.MouseEvent<HTMLElement>) => void;
}

const ProjectedScheduleTableRowEditingModal: FC<Props> = ({
  doubleClickedRowAndBefore,
  prescribedDrug,
  visible, onCancel, onOk,
}) => {
  const {
    drugs,
    lastPrescriptionFormId,
    projectedSchedule,
    modal_prevRow,
    modal_doubleClickedRow,
    prescribedDrugs,
  } = useSelector<RootState, TaperConfigState>((state) => state.taperConfig);
  // const [drugFromRow, setDrugFromRow] = useState<PrescribedDrug | null>(null);
  const dispatch = useDispatch();
  // const [prescribedDrugId, setPrescribedDrugId] = useState<number>(-1);

  useEffect(() => {
    console.group('ProjectedScheduleTableRowEditingModal');
    console.log(doubleClickedRowAndBefore);
    console.groupEnd();
  }, []);

  useEffect(() => {
    console.group('PrescribedDrug changed');
    console.log(prescribedDrug);
    console.groupEnd();
  }, [prescribedDrug]);

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

    // TODO: need to handle the case where Ok is clicked without any changes

    onOk(e);
    dispatch({
      type: EDIT_PROJECTED_SCHEDULE_FROM_MODAL,
    });
  };

  const onClickCancel = (e: React.MouseEvent<HTMLElement>) => {
    onCancel(e);
    dispatch({
      type: REMOVE_DRUG_FORM,
      // data: prescribedDrug.id,
    });
  };

  return <Modal visible={visible}
                onCancel={onClickCancel}
                onOk={onClickOk}
                width={'50%'}
                css={css`height: 85%;
                  overflow-y: scroll;`}>
    <PrescriptionForm prescribedDrug={prescribedDrug} title={''} isModal={true}/>
  </Modal>;
};

export default ProjectedScheduleTableRowEditingModal;
