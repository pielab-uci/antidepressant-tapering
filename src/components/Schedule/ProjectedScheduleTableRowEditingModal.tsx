import * as React from 'react';
import Modal from 'antd/es/modal';
import { FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import PrescriptionSettingsForm from '../PrescriptionForm/PrescriptionSettingsForm';
import { DrugForm, DrugOption, TableRowData } from '../../types';
import { RootState } from '../../redux/reducers';
import { TaperConfigState } from '../../redux/reducers/taperConfig';
import PrescriptionForm from '../PrescriptionForm/PrescriptionForm';

interface Props {
  row: TableRowData | null;
  visible: boolean;
  onCancel: (e: React.MouseEvent<HTMLElement>) => void;
  onOk: (e: React.MouseEvent<HTMLElement>) => void;
}

const ProjectedScheduleTableRowEditingModal: FC<Props> = ({
  row, visible, onCancel, onOk,
}) => {
  const { drugs } = useSelector<RootState, TaperConfigState>((state) => state.taperConfig);
  const dispatch = useDispatch();

  const onClickOk = (e: React.MouseEvent<HTMLElement>) => {
    onOk(e);
    // TODO: generate new rows..
  };

  const onClickCancel = (e: React.MouseEvent<HTMLElement>) => {
    onCancel(e);
  };

  if (row === null) {
    return <div/>;
  }

  return <Modal visible={visible} onCancel={onClickCancel} onOk={onClickOk} width={'50%'}>
    {row && <PrescriptionForm prescribedDrug={row.prescribedDrug} title={''}/>}
  </Modal>;
};

export default ProjectedScheduleTableRowEditingModal;
