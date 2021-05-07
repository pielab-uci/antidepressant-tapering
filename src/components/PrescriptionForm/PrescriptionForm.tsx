import * as React from 'react';
import { useEffect, createContext, FC } from 'react';
import { useReducer, useState } from 'reinspect';
import { Button, Select } from 'antd';
import { useDispatch } from 'react-redux';
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
  ChooseBrandAction, DrugNameChangeAction, FetchDrugsAction,
} from './actions';
import { IPrescriptionFormContext, PrescriptionFormState } from './types';
import { Drug, DrugForm } from '../../types';
import {
  CLEAR_SCHEDULE,
  ClearScheduleAction,
  REMOVE_DRUG_FORM,
  RemoveDrugFormAction,
} from '../../redux/actions/taperConfig';
import TotalQuantities from '../TotalQuantities';
import SelectInterval from '../SelectInterval';

const { OptGroup, Option } = Select;

export const PrescriptionFormContext = createContext<IPrescriptionFormContext>({
  ...initialState,
  Current: { dosages: initialState.currentDosagesQty, action: currentDosageChange },
  Next: { dosages: initialState.nextDosagesQty, action: nextDosageChange },
  formActionDispatch: () => {
  },
  id: -1,
});

interface Props {
  id: number;
  drugs: Drug[];
}

const PrescriptionForm: FC<Props> = ({ id, drugs }) => {
  const taperConfigActionDispatch = useDispatch();
  const [state, formActionDispatch] = useReducer<PrescriptionFormReducer, PrescriptionFormState>(reducer, initialState, (init) => initialState, `PrescriptionFormReducer_${id}`);

  const {
    chosenDrug, chosenBrand, chosenDrugForm, drugFormOptions,
    currentDosagesQty, nextDosagesQty, minDosageUnit,
  } = state;

  const [showTotalQuantities, setShowTotalQuantities] = useState(true, `PrescriptionForm-ShowTotalQuantities_${id}`);

  useEffect(() => {
    const action: FetchDrugsAction = {
      type: FETCH_DRUGS,
      data: { drugs, id },
    };
    // taperConfigActionDispatch(action);
    formActionDispatch(action);
  }, [drugs]);

  /*
  useEffect(() => {
    setShowTotalQuantities(
      ![chosenDrug, chosenBrand, chosenDrugForm,
        intervalStartDate, intervalEndDate].some((el) => el === null),
    );
  }, [chosenDrug, chosenBrand, chosenDrugForm, intervalStartDate, intervalEndDate]);
   */

  const onSubmit = () => {
  };

  const onDrugNameChange = (value: string) => {
    const action: DrugNameChangeAction = {
      type: DRUG_NAME_CHANGE,
      data: { name: value, id },
    };
    taperConfigActionDispatch(action);
    formActionDispatch(action);
  };

  const onBrandChange = (value: string) => {
    const action: ChooseBrandAction = {
      type: CHOOSE_BRAND,
      data: { brand: value, id },
    };

    formActionDispatch(action);
    taperConfigActionDispatch(action);
  };

  // TODO: use custom hook instead?
  const onFormChange = (value: string) => {
    const action: ChooseFormAction = {
      type: CHOOSE_FORM,
      data: { form: value, id },
    };

    formActionDispatch(action);
  };

  useEffect(() => {
    if (chosenDrugForm) {
      taperConfigActionDispatch<ChooseFormAction>({
        type: CHOOSE_FORM,
        data: { form: chosenDrugForm!.form, minDosageUnit, id },
      });
    }
  }, [chosenDrugForm, minDosageUnit]);

  const removeDrugForm = () => {
    taperConfigActionDispatch<RemoveDrugFormAction>({
      type: REMOVE_DRUG_FORM,
      data: id,
    });
    taperConfigActionDispatch<ClearScheduleAction>({
      type: CLEAR_SCHEDULE,
    });
  };

  const renderDosages = (chosenDrugForm: DrugForm | null | undefined, time: 'Current' | 'Next', dosages: { [key: string]: number }) => (
    <>
      {chosenDrugForm
        ? <Dosages time={time} dosages={dosages} />
        : <div>No drug form selected</div>}
    </>
  );

  return (
    <PrescriptionFormContext.Provider value={{
      ...state,
      id,
      Current: { dosages: currentDosagesQty, action: currentDosageChange },
      Next: { dosages: nextDosagesQty, action: nextDosageChange },
      formActionDispatch,
    }}
    >
      <Button onClick={removeDrugForm}>Remove</Button>
      <form onSubmit={onSubmit}>
        <h3>Drug Name</h3>
        <Select showSearch defaultValue="" value={chosenDrug?.name} onChange={onDrugNameChange} style={{ width: 200 }}>
          {drugs.map((drug) => <Option key={drug.name} value={drug.name}>{drug.name}</Option>)}
        </Select>

        <h3>Prescription settings</h3>
        <label>Brand</label>
        {/* <Select showSearch defaultValue="" value={chosenBrand?.brand} onChange={onBrandChange} style={{ width: 200 }}> */}
        {/*  {brandOptions?.map( */}
        {/*    (brand) => <Option key={brand.brand} value={brand.brand}>{brand.brand}</Option>, */}
        {/*  )} */}
        {/* </Select> */}
        <Select showSearch defaultValue="" value={chosenBrand?.brand} onChange={onBrandChange} style={{ width: 200 }}>
          {drugs.map(
            (drug) => (<OptGroup key={`${drug.name}_group`} label={drug.name}>
              {drug.options.map(
                (option) => <Option key={option.brand} value={option.brand}>{option.brand}</Option>,
              )}
            </OptGroup>),
          )}
        </Select>
        <label>Form</label>
        <Select defaultValue="" value={chosenDrugForm?.form} onChange={onFormChange} style={{ width: 200 }}>
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
