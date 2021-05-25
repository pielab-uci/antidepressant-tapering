import * as React from 'react';
import { useEffect, createContext, FC } from 'react';
import { useReducer, useState } from 'reinspect';
import { Button, Checkbox, Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import {
  CapsuleOrTabletDosages, PrescribedDosageQuantities, SelectInterval, OralFormDosage,
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
  CapsuleOrTabletForm,
  DrugForm, isCapsuleOrTablet, OralForm, PrescribedDrug,
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
    dosageChangeAction: priorDosageChange,
  },
  Upcoming: {
    dosages: initialState.upcomingDosagesQty,
    dosageChangeAction: upcomingDosageChange,
  },
  formActionDispatch: () => {},
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
    priorDosagesQty, upcomingDosagesQty, minDosageUnit,
    availableDosageOptions, allowSplittingUnscoredTablet,
    oralDosageInfo,
  } = state;
  const { drugs } = useSelector<RootState, TaperConfigState>((state) => state.taperConfig);
  const [showTotalQuantities, setShowTotalQuantities] = useState(true, `PrescriptionForm-ShowTotalQuantities_${prescribedDrug.id}`);

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
  // }, [prescribedDrug]);

  const onBrandChange = (value: string) => {
    const action: ChooseBrandAction = {
      type: CHOOSE_BRAND,
      data: { brand: value, id: prescribedDrug.id },
    };

    formActionDispatch(action);
    taperConfigActionDispatch(action);
  };

  // use custom hook instead?
  const onFormChange = (value: string) => {
    const action: ChooseFormAction = {
      type: CHOOSE_FORM,
      data: { form: value, id: prescribedDrug.id },
    };

    formActionDispatch(action);
  };

  // TODO: need to refactor..? can be handled in redux saga instead of using useEffect..?
  useEffect(() => {
    if (chosenDrugForm) {
      taperConfigActionDispatch<ChooseFormAction>({
        type: CHOOSE_FORM,
        data: {
          form: chosenDrugForm!.form,
          minDosageUnit,
          availableDosageOptions,
          id: prescribedDrug.id,
          oralDosageInfo: isCapsuleOrTablet(chosenDrugForm) ? null : oralDosageInfo,
        },
      });
    }
  }, [chosenDrugForm, minDosageUnit]);

  const removeDrugForm = () => {
    taperConfigActionDispatch<RemoveDrugFormAction>({
      type: REMOVE_DRUG_FORM,
      data: prescribedDrug.id,
    });
    taperConfigActionDispatch<ClearScheduleAction>({
      type: CLEAR_SCHEDULE,
    });
  };

  const renderDosages = (drugForm: DrugForm | null | undefined, time: 'Prior' | 'Upcoming', dosages: { [key: string]: number }) => {
    // TODO: render drug dosage depending on its form
    if (!drugForm) {
      return <div>No drug form selected.</div>;
    }

    if (isCapsuleOrTablet(drugForm)) {
      return <CapsuleOrTabletDosages time={time} dosages={dosages} />;
    }

    return <OralFormDosage time={time} />;
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
        <h3>Prescription settings</h3>
        <label>Brand</label>
        <Select showSearch value={chosenBrand?.brand} onChange={onBrandChange} style={{ width: 200 }}>
          {drugsLocal?.map(
            (drug) => (<OptGroup key={`${drug.name}_group`} label={drug.name}>
              {drug.options.map(
                (option) => <Option key={option.brand} value={option.brand}>{option.brand}</Option>,
              )}
            </OptGroup>),
          )}
        </Select>
        <label>Form</label>
        <Select value={chosenDrugForm?.form} onChange={onFormChange} style={{ width: 200 }}>
          {drugFormOptions?.map(
            (form: CapsuleOrTabletForm | OralForm) => <Option key={form.form} value={form.form}>{form.form}</Option>,
          )}
        </Select>
      {chosenDrugForm?.form === 'tablet' && <Checkbox checked={allowSplittingUnscoredTablet} onChange={toggleAllowSplittingUnscoredTabletCheckbox}>Allow splitting unscored tablet</Checkbox>}
        <hr />

        {renderDosages(chosenDrugForm, 'Prior', priorDosagesQty)}
        <hr />
        {renderDosages(chosenDrugForm, 'Upcoming', upcomingDosagesQty)}
        <hr/>
        <SelectInterval />
        <hr/>
        {showTotalQuantities && <PrescribedDosageQuantities/>}
      <hr />
    </PrescriptionFormContext.Provider>
  );
};
export default PrescriptionForm;
