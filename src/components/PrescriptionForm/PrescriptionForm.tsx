import * as React from 'react';
import { useEffect, createContext, FC } from 'react';
import { useReducer } from 'reinspect';
import {
  Button, Checkbox, Select, Tooltip,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { GrCircleInformation } from 'react-icons/gr';
import { css } from '@emotion/react';
import {
  CapsuleOrTabletDosages, SelectInterval, OralFormDosage,
} from '.';
import {
  initialState,
  reducer,
  PrescriptionFormReducer,
} from './reducer';
import {
  CHOOSE_BRAND,
  CHOOSE_FORM,
  FETCH_DRUGS,
  priorDosageChange,
  upcomingDosageChange,
  ChooseFormAction,
  ChooseBrandAction,
  FetchDrugsAction,
  LOAD_PRESCRIPTION_DATA, toggleAllowSplittingUnscoredTablet,
} from './actions';
import { IPrescriptionFormContext, PrescriptionFormState } from './types';
import {
  CapsuleOrTabletDosage,
  CapsuleOrTabletForm,
  DrugForm, isCapsuleOrTablet, OralDosage, OralForm, PrescribedDrug,
} from '../../types';
import {
  CLEAR_SCHEDULE,
  ClearScheduleAction,
  REMOVE_DRUG_FORM,
  RemoveDrugFormAction,
} from '../../redux/actions/taperConfig';

import { RootState } from '../../redux/reducers';
import { TaperConfigState } from '../../redux/reducers/taperConfig';

const { OptGroup, Option } = Select;

export const PrescriptionFormContext = createContext<IPrescriptionFormContext>({
  ...initialState,
  Prior: {
    dosages: initialState.priorDosagesQty,
  },
  Upcoming: {
    dosages: initialState.upcomingDosagesQty,
  },
  formActionDispatch: () => {
  },
  id: -1,
});

interface Props {
  prescribedDrug: PrescribedDrug;
}

const PrescriptionForm: FC<Props> = ({ prescribedDrug }) => {
  const taperConfigActionDispatch = useDispatch();
  const [state, formActionDispatch] = useReducer<PrescriptionFormReducer, PrescriptionFormState>(reducer, initialState, (init) => initialState, `PrescriptionFormReducer_${prescribedDrug.id}`);

  const {
    drugs: drugsLocal, chosenBrand, chosenDrugForm, drugFormOptions,
    priorDosagesQty, upcomingDosagesQty, allowSplittingUnscoredTablet,
  } = state;
  const { drugs } = useSelector<RootState, TaperConfigState>((state) => state.taperConfig);

  useEffect(() => {
    const action: FetchDrugsAction = {
      type: FETCH_DRUGS,
      data: { drugs, id: prescribedDrug.id },
    };
    formActionDispatch(action);

    if (prescribedDrug.name !== '') {
      formActionDispatch({ type: LOAD_PRESCRIPTION_DATA, data: prescribedDrug });
    }
  }, []);

  const onBrandChange = (value: string) => {
    const action: ChooseBrandAction = {
      type: CHOOSE_BRAND,
      data: { brand: value, id: prescribedDrug.id },
    };

    formActionDispatch(action);
    taperConfigActionDispatch(action);
  };

  const onFormChange = (value: string) => {
    const chooseFormActionData: ChooseFormAction['data'] = {
      form: value,
      id: prescribedDrug.id,
      minDosageUnit: -1,
      availableDosageOptions: [],
      regularDosageOptions: [],
      oralDosageInfo: null,
    };

    const newChosenDrugForm = drugFormOptions!.find((form) => form.form === value)!;
    if (value === 'capsule' || value === 'tablet') {
      chooseFormActionData.oralDosageInfo = null;
      // TODO: consider if tablet is scored..?
      const minDosage = Math.min(...(newChosenDrugForm.dosages as CapsuleOrTabletDosage[])
        .map((dosage) => parseFloat(dosage.dosage)));
      chooseFormActionData.minDosageUnit = value === 'capsule' ? minDosage : minDosage / 2;
      chooseFormActionData.regularDosageOptions = (newChosenDrugForm.dosages as CapsuleOrTabletDosage[])
        .map((option) => option.dosage);
      chooseFormActionData.availableDosageOptions = [
        ...new Set(
          (newChosenDrugForm.dosages as CapsuleOrTabletDosage[])
            .flatMap((option) => {
              if (option.isScored) {
                return [`${parseFloat(option.dosage) / 2}${newChosenDrugForm.measureUnit}`, option.dosage];
              }
              return option.dosage;
            }),
        )];
    } else {
      chooseFormActionData.oralDosageInfo = (newChosenDrugForm.dosages as OralDosage);
      chooseFormActionData.minDosageUnit = chooseFormActionData.oralDosageInfo.rate.mg;
      chooseFormActionData.regularDosageOptions = null;
      chooseFormActionData.availableDosageOptions = ['1mg'];
    }

    formActionDispatch({
      type: CHOOSE_FORM,
      data: chooseFormActionData,
    });
    taperConfigActionDispatch({
      type: CHOOSE_FORM,
      data: chooseFormActionData,
    });
  };

  const removeDrugForm = () => {
    taperConfigActionDispatch<RemoveDrugFormAction>({
      type: REMOVE_DRUG_FORM,
      data: prescribedDrug.id,
    });
    taperConfigActionDispatch<ClearScheduleAction>({
      type: CLEAR_SCHEDULE,
    });
  };

  const renderDosages = (drugForm: DrugForm | null | undefined, time: 'Prior' | 'Upcoming') => {
    if (!drugForm) {
      return <div>No drug form selected.</div>;
    }

    if (isCapsuleOrTablet(drugForm)) {
      return <CapsuleOrTabletDosages time={time}/>;
    }

    return <OralFormDosage time={time}/>;
  };

  const toggleAllowSplittingUnscoredTabletCheckbox = (e: CheckboxChangeEvent) => {
    formActionDispatch(toggleAllowSplittingUnscoredTablet({ id: prescribedDrug.id, allow: e.target.checked }));
    taperConfigActionDispatch(toggleAllowSplittingUnscoredTablet({ id: prescribedDrug.id, allow: e.target.checked }));
  };

  return (
    <PrescriptionFormContext.Provider value={{
      ...state,
      id: prescribedDrug.id,
      Prior: {
        dosages: priorDosagesQty,
        dosageChangeAction: priorDosageChange,
      },
      Upcoming: {
        dosages: upcomingDosagesQty,
        dosageChangeAction: upcomingDosageChange,
      },
      formActionDispatch,
    }}
    >
      <Button onClick={removeDrugForm}>Remove</Button>
      <div css={css`
        width: 288px;
        
        & > h3 {
          font-size: 18px;
          font-family: Futura;
        }

        & .medication-select-form {
          display: flex;
          margin: 15px 0 15px 51px;
        }
      `}>
        <h3>Prescription settings</h3>
        <div>
          <div className='medication-select-form'>
            <label>Brand</label>
            <Select showSearch value={chosenBrand?.brand} onChange={onBrandChange} style={{ width: 200 }}>
              {drugsLocal?.map(
                (drug) => (
                  <OptGroup key={`${drug.name}_group`} label={drug.name}>
                    {drug.options.map(
                      (option) => <Option key={option.brand} value={option.brand}>{option.brand}</Option>,
                    )}
                  </OptGroup>),
              )}
            </Select>
            <Tooltip title={prescribedDrug.halfLife} overlayStyle={{ whiteSpace: 'pre-line' }}>
              <GrCircleInformation/>
            </Tooltip>
          </div>
          <div className='medication-select-form'>
            <label>Form</label>
            <Select value={chosenDrugForm?.form} onChange={onFormChange} style={{ width: 200 }}>
              {drugFormOptions?.map(
                (form: CapsuleOrTabletForm | OralForm) => <Option key={form.form}
                                                                  value={form.form}>{form.form}</Option>,
              )}
            </Select>
          </div>
        </div>
        <div>
          {chosenDrugForm?.form === 'tablet'
          && <Checkbox checked={allowSplittingUnscoredTablet} onChange={toggleAllowSplittingUnscoredTabletCheckbox}>Allow
            splitting unscored tablet</Checkbox>}
        </div>
      </div>

      {renderDosages(chosenDrugForm, 'Prior')}
      <hr/>
      {renderDosages(chosenDrugForm, 'Upcoming')}
      <hr/>
      <SelectInterval/>
      <hr/>
      <hr/>
    </PrescriptionFormContext.Provider>
  );
};
export default PrescriptionForm;
