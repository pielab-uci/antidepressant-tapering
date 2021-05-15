import * as React from 'react';
import { useEffect, createContext, FC } from 'react';
import { useReducer, useState } from 'reinspect';
import { Button, Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import Dosages from '../Dosages';
import {
  initialState,
  reducer,
  PrescriptionFormReducer,
} from './reducer';
import {
  CHOOSE_BRAND,
  CHOOSE_FORM,
  DRUG_NAME_CHANGE,
  FETCH_DRUGS,
  currentDosageChange,
  nextDosageChange,
  ChooseFormAction,
  ChooseBrandAction,
  DrugNameChangeAction,
  FetchDrugsAction,
  currentAllowSplittingUnscoredDosageUnit,
  nextAllowSplittingUnscoredDosageUnit, LOAD_PRESCRIPTION_DATA,
} from './actions';
import { IPrescriptionFormContext, PrescriptionFormState } from './types';
import {
  DrugForm, PrescribedDrug,
} from '../../types';
import {
  CLEAR_SCHEDULE,
  ClearScheduleAction,
  REMOVE_DRUG_FORM,
  RemoveDrugFormAction,
} from '../../redux/actions/taperConfig';
import TotalQuantities from '../TotalQuantities';
import SelectInterval from '../SelectInterval';
import { RootState } from '../../redux/reducers';
import { TaperConfigState } from '../../redux/reducers/taperConfig';

const { OptGroup, Option } = Select;

// TODO: considering removing local reducer for PrescriptionForm..?

export const PrescriptionFormContext = createContext<IPrescriptionFormContext>({
  ...initialState,
  Current: {
    dosages: initialState.currentDosagesQty,
    allowSplittingUnscored: initialState.currentDosageAllowSplittingUnscoredUnit,
    dosageChangeAction: currentDosageChange,
    toggleAllowSplittingUnscored: currentAllowSplittingUnscoredDosageUnit,
  },
  Next: {
    dosages: initialState.nextDosagesQty,
    allowSplittingUnscored: initialState.nextDosageAllowSplittingUnscoredUnit,
    dosageChangeAction: nextDosageChange,
    toggleAllowSplittingUnscored: nextAllowSplittingUnscoredDosageUnit,
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
    currentDosagesQty, nextDosagesQty, minDosageUnit,
    currentDosageAllowSplittingUnscoredUnit,
    nextDosageAllowSplittingUnscoredUnit,
    availableDosageOptions,
  } = state;
  const { drugs, prescribedDrugs } = useSelector<RootState, TaperConfigState>((state) => state.taperConfig);
  const [showTotalQuantities, setShowTotalQuantities] = useState(true, `PrescriptionForm-ShowTotalQuantities_${prescribedDrug.id}`);

  useEffect(() => {
    const action: FetchDrugsAction = {
      type: FETCH_DRUGS,
      data: { drugs, id: prescribedDrug.id },
    };
    // taperConfigActionDispatch(action);
    formActionDispatch(action);

    // const prescribedDrugIdx = prescribedDrugs.findIndex((drug) => drug.id === prescribedDrug.id);
    // console.log('prescribedDrugs: ', prescribedDrugs);
    // console.log('prescribedDrugsIdx: ', prescribedDrugIdx);
    // if (prescribedDrugIdx !== -1) {
    //   formActionDispatch({ type: LOAD_PRESCRIPTION_DATA, data: prescribedDrugs[prescribedDrugIdx] });
    // }
    formActionDispatch({ type: LOAD_PRESCRIPTION_DATA, data: prescribedDrug });
  }, []);
  // }, [prescribedDrugs]);

  /*
  useEffect(() => {
    setShowTotalQuantities(
      ![chosenDrug, chosenBrand, chosenDrugForm,
        intervalStartDate, intervalEndDate].some((el) => el === null),
    );
  }, [chosenDrug, chosenBrand, chosenDrugForm, intervalStartDate, intervalEndDate]);
   */

  const onSubmit = () => {};

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

  useEffect(() => {
    if (chosenDrugForm) {
      taperConfigActionDispatch<ChooseFormAction>({
        type: CHOOSE_FORM,
        data: {
          form: chosenDrugForm!.form, minDosageUnit, availableDosageOptions, id: prescribedDrug.id,
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

  const renderDosages = (drugForm: DrugForm | null | undefined, time: 'Current' | 'Next', dosages: { [key: string]: number }) => (
    <>
      {drugForm
        ? <Dosages time={time} dosages={dosages} />
        : <div>No drug form selected</div>}
    </>
  );

  return (
    <PrescriptionFormContext.Provider value={{
      ...state,
      id: prescribedDrug.id,
      Current: {
        dosages: currentDosagesQty,
        allowSplittingUnscored: currentDosageAllowSplittingUnscoredUnit,
        dosageChangeAction: currentDosageChange,
        toggleAllowSplittingUnscored: currentAllowSplittingUnscoredDosageUnit,
      },
      Next: {
        dosages: nextDosagesQty,
        allowSplittingUnscored: nextDosageAllowSplittingUnscoredUnit,
        dosageChangeAction: nextDosageChange,
        toggleAllowSplittingUnscored: nextAllowSplittingUnscoredDosageUnit,
      },
      formActionDispatch,
    }}
    >
      <Button onClick={removeDrugForm}>Remove</Button>
      <form onSubmit={onSubmit}>
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
            (form) => <Option key={form.form} value={form.form}>{form.form}</Option>,
          )}
        </Select>
        <hr />

        <div>Current Dosages</div>
        {renderDosages(chosenDrugForm, 'Current', currentDosagesQty)}
        <hr />
        <div>Next Dosages</div>
        {renderDosages(chosenDrugForm, 'Next', nextDosagesQty)}
        <hr/>
        <SelectInterval />
        <hr/>
        {showTotalQuantities && <TotalQuantities/>}
      </form>
      <hr />
    </PrescriptionFormContext.Provider>
  );
};
export default PrescriptionForm;
