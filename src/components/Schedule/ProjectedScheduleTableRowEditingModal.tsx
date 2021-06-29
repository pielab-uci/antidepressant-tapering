import * as React from 'react';
import Modal from 'antd/es/modal';
import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { css } from '@emotion/react';
import { RowDoubleClickedEvent } from 'ag-grid-community';
import PrescriptionSettingsForm from '../PrescriptionForm/PrescriptionSettingsForm';
import {
  DrugForm, DrugOption, PrescribedDrug, TableRowData,
} from '../../types';
import { RootState } from '../../redux/reducers';
import { TaperConfigState } from '../../redux/reducers/taperConfig';
import PrescriptionForm from '../PrescriptionForm/PrescriptionForm';

interface Props {
  doubleClickEvent: RowDoubleClickedEvent | null;
  visible: boolean;
  onCancel: (e: React.MouseEvent<HTMLElement>) => void;
  onOk: (e: React.MouseEvent<HTMLElement>) => void;
}

const ProjectedScheduleTableRowEditingModal: FC<Props> = ({
  doubleClickEvent, visible, onCancel, onOk,
}) => {
  const { drugs, lastPrescriptionFormId, projectedSchedule } = useSelector<RootState, TaperConfigState>((state) => state.taperConfig);
  const [drugFromRow, setDrugFromRow] = useState<PrescribedDrug|null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (doubleClickEvent) {
      const previousRow: TableRowData = doubleClickEvent.api.getRowNode(`${parseFloat(doubleClickEvent.node.id!) - 1}`)!.data;

      setDrugFromRow({
        ...doubleClickEvent!.data.prescribedDrug,
        id: lastPrescriptionFormId + 1,

      });
    }
  }, [doubleClickEvent]);

  const onClickOk = (e: React.MouseEvent<HTMLElement>) => {
    onOk(e);
    // TODO: dispatch add new prescribedDrug
  };

  const onClickCancel = (e: React.MouseEvent<HTMLElement>) => {
    onCancel(e);
  };

  if (doubleClickEvent === null) {
    return <div/>;
  }

  return <Modal visible={visible} onCancel={onClickCancel} onOk={onClickOk} width={'50%'}
                css={css`height: 85%; overflow-y: scroll;`}>
    {doubleClickEvent && <PrescriptionForm prescribedDrug={doubleClickEvent.prescribedDrug} title={''}/>}
  </Modal>;
};

export default ProjectedScheduleTableRowEditingModal;
