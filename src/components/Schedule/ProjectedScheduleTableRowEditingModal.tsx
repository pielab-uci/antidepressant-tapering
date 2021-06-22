import * as React from 'react';
import Modal from 'antd/es/modal';
import { FC } from 'react';

interface Props {
  visible: boolean;
  onCancel: (e: React.MouseEvent<HTMLElement>) => void;
  onOk: (e: React.MouseEvent<HTMLElement>) => void;
}

const ProjectedScheduleTableRowEditingModal: FC<Props> = ({ visible, onCancel, onOk }) => {
  return <Modal visible={visible} onCancel={onCancel} onOk={onOk}>

  </Modal>;
};

export default ProjectedScheduleTableRowEditingModal;
