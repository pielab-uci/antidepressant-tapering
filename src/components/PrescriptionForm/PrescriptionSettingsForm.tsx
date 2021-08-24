import * as React from 'react';
import { css } from '@emotion/react';
import Select from 'antd/es/select';
import Tooltip from 'antd/es/tooltip';
import { GrCircleInformation } from 'react-icons/gr';
import Checkbox, { CheckboxChangeEvent } from 'antd/es/checkbox';
import {
  FC, useContext, useEffect, useState,
} from 'react';
import { useSelector } from 'react-redux';
import {
  CapsuleOrTabletForm, DrugForm, DrugOption, OralForm, PrescribedDrug,
} from '../../types';
import { TaperConfigState } from '../../redux/reducers/taperConfig';
import { RootState } from '../../redux/reducers';
import { PrescriptionFormContext } from './PrescriptionForm';
import { DrugFormNames } from './actions';

const { OptGroup, Option } = Select;

interface Props {
  prescribedDrug: PrescribedDrug;
  chosenBrand: DrugOption | null;
  onBrandChange: (value: string) => void;
  chosenDrugForm: DrugForm | undefined | null;
  onFormChange: (value: DrugFormNames) => void;
  allowSplittingUnscoredTablet: boolean;
  toggleAllowSplittingUnscoredTabletCheckbox: (e: CheckboxChangeEvent) => void;
}

const PrescriptionSettingsForm: FC<Props> = ({
  prescribedDrug,
  chosenBrand,
  chosenDrugForm,
  onBrandChange,
  onFormChange,
  allowSplittingUnscoredTablet,
  toggleAllowSplittingUnscoredTabletCheckbox,
}) => {
  const {
    drugs, chosenDrugs, prescribedDrugs,
  } = useSelector<RootState, TaperConfigState>((state) => state.taperConfig);
  const { id } = useContext(PrescriptionFormContext);
  const [drugFormOptions, setDrugFormOptions] = useState<DrugForm[] | null>(null);

  useEffect(() => {
    setDrugFormOptions(chosenBrand?.forms || null);
  }, [chosenBrand]);

  return (
    <div css={css`
      width: 700px;

      & .medication-select-form {
        display: flex;
        width: 250px;
        justify-content: space-between;
        margin: 15px 30px 15px 51px;
        align-items: center;
      }`}>
      <div>
        <h3 css={css`font-size: 1rem;`}>Prescription settings</h3>
        <div css={css`display: flex;
          align-items: center;`}>
          <div className='medication-select-form'>
            <label>Brand:</label>
            <Select showSearch value={chosenBrand?.brand} onChange={onBrandChange} css={css`width: 200px`}>
              {drugs?.map(
                (drug) => {
                  const anotherFormId = Object.keys(chosenDrugs).find((k) => parseInt(k, 10) !== id);
                  // console.group('Select...');
                  // console.log('id: ', id);
                  // console.log('anotherFormId: ', anotherFormId);
                  // console.groupEnd();
                  return (<OptGroup key={`${drug.name}_group`} label={drug.name}>
                      {drug.options.map(
                        (option) => {
                          const disabled = anotherFormId !== undefined && drug.name === chosenDrugs[parseInt(anotherFormId, 10)].drug;
                          return <Option key={option.brand} value={option.brand}
                                         disabled={disabled}>{option.brand}</Option>;
                        },
                      )}
                    </OptGroup>);
                },
              )}
            </Select>
          </div>
          <Tooltip title={`Half-life\n${prescribedDrug.halfLife}`} overlayStyle={{ whiteSpace: 'pre-line' }}>
            <GrCircleInformation size={'16px'}/>
          </Tooltip>
        </div>
        <div css={css`display: flex;
          align-items: center;`}>
          <div className='medication-select-form'>
            <label>Form:</label>
            <Select value={chosenDrugForm?.form} onChange={onFormChange} style={{ width: 200 }}>
              {drugFormOptions?.map(
                (form: CapsuleOrTabletForm | OralForm) => <Option key={form.form}
                                                                  value={form.form}>{form.form}</Option>,
              )}
            </Select>
          </div>
          {chosenDrugForm?.form === 'tablet'
          && <Checkbox checked={allowSplittingUnscoredTablet} onChange={toggleAllowSplittingUnscoredTabletCheckbox}>Allow
            splitting unscored tablet</Checkbox>}
        </div>
      </div>
    </div>
  );
};

export default PrescriptionSettingsForm;
