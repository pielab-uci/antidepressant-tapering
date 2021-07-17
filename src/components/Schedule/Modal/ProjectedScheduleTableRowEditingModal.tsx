import * as React from 'react';
import { FC, useEffect } from 'react';
import Modal from 'antd/es/modal';
import { useDispatch, useSelector } from 'react-redux';
import { css } from '@emotion/react';
import { useReducer } from 'reinspect';
import { TableRowData } from '../../../types';
import { RootState } from '../../../redux/reducers';
import { TaperConfigState } from '../../../redux/reducers/taperConfig';
import PrescriptionForm from '../../PrescriptionForm/PrescriptionForm';
import { EDIT_PROJECTED_SCHEDULE_FROM_MODAL, REMOVE_DRUG_FORM } from '../../../redux/actions/taperConfig';
import reducer, {
  initialState,
  POPULATE_PRESCRIBED_DRUG_FROM_DOUBLE_CLICKED_ROW_AND_BEFORE,
  RowEditingModalReducer,
  RowEditingModalState,
} from './modalReducer';

interface Props {
  visible: boolean;
  doubleClickedRowAndBefore: [TableRowData, TableRowData];
  onCancel: (e: React.MouseEvent<HTMLElement>) => void;
  onOk: (e: React.MouseEvent<HTMLElement>) => void;
}

const ProjectedScheduleTableRowEditingModal: FC<Props> = ({
  doubleClickedRowAndBefore,
  visible, onCancel, onOk,
}) => {
  // const [drugFromRow, setDrugFromRow] = useState<PrescribedDrug | null>(null);
  const [state, modalDispatch] = useReducer<RowEditingModalReducer, RowEditingModalState>(reducer, initialState, (init) => initialState, 'ProjectedScheduleTableRowEditingModal');
  const { prescribedDrug } = state;
  const dispatch = useDispatch();
  // const [prescribedDrugId, setPrescribedDrugId] = useState<number>(-1);

  useEffect(() => {
    console.group('ProjectedScheduleTableRowEditingModal');
    console.log(doubleClickedRowAndBefore);
    modalDispatch({
      type: POPULATE_PRESCRIBED_DRUG_FROM_DOUBLE_CLICKED_ROW_AND_BEFORE,
      data: { prevRow: doubleClickedRowAndBefore[0], doubleClickedRow: doubleClickedRowAndBefore[1] },
    });
    console.groupEnd();
  }, []);

  const onClickOk = (e: React.MouseEvent<HTMLElement>) => {
    console.log('Modal.onOk');
    onOk(e);
    dispatch({
      type: EDIT_PROJECTED_SCHEDULE_FROM_MODAL,
      data: { prevRow: doubleClickedRowAndBefore[0], doubleClickedRow: doubleClickedRowAndBefore[1], prescribedDrug },
    });
  };

  const onClickCancel = (e: React.MouseEvent<HTMLElement>) => {
    console.log('Modal.onCancel');
    onCancel(e);
    // TODO: flush prescribedDrug for modal..?
    // dispatch({
    //   type: REMOVE_DRUG_FORM,
    // data: prescribedDrug.id,
    // });
  };

  return prescribedDrug
    && <Modal visible={visible}
           onCancel={onClickCancel}
           onOk={onClickOk}
           width={'70%'}
           centered={true}
           css={css`height: 90%;
             overflow-y: scroll; padding: 0;`}>
      <PrescriptionForm prescribedDrug={prescribedDrug} title={''} modal={{ isModal: true, modalDispatch }}/>
    </Modal>;
};

export default ProjectedScheduleTableRowEditingModal;
