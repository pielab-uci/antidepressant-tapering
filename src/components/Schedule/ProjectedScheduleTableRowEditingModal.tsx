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
  const [chosenBrand, setChosenBrand] = useState<DrugOption | null>(
    drugs.find((drug) => drug.name === row!.drug)!
      .options.find((brand) => brand.brand === row!.brand)! || null,
  );
  const [chosenDrugForm, setChosenDrugForm] = useState<DrugForm | null>(
    drugs.find((drug) => drug.name === row!.drug)!
      .options.find((brand) => brand.brand === row!.brand)!
      .forms.find((form) => form.form === row!.form)! || null,
  );
  const [allowSplittingUnscoredTablet, setAllowSplittingUnscoredTablet] = useState<boolean>(false);

  const onBrandChange = (value: string) => {
    setChosenBrand(drugs.find((drug) => drug.name === row!.drug)!.options.find((brand) => brand.brand === value)!);
    setChosenDrugForm(null);
  };

  const onFormChange = (value: string) => {
    setChosenDrugForm((chosenBrand && chosenBrand.forms.find((form) => form.form === value)!) || null);
  };

  const toggleAllowSplittingUnscoredTabletCheckbox = (e: CheckboxChangeEvent) => {
    setAllowSplittingUnscoredTablet(e.target.checked);
  };

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

  return <Modal visible={visible} onCancel={onClickCancel} onOk={onClickOk}>
    {row && <PrescriptionForm prescribedDrug={row.prescribedDrug} title={''}/>}
  </Modal>;
};

export default ProjectedScheduleTableRowEditingModal;
