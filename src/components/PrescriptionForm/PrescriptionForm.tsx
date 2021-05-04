import * as React from 'react';
import { useEffect, createContext, FC } from 'react';
import { useReducer, useState } from 'reinspect';
import { Button, Select } from 'antd';
import { useDispatch } from 'react-redux';
import Dosages from '../Dosages';
import SelectInterval from '../SelectInterval';
import {
  initialState,
  reducer,
  PrescriptionFormReducer,
} from './reducer';
import {
  CHOOSE_BRAND, CHOOSE_FORM,
  DRUG_NAME_CHANGE, FETCH_DRUGS, currentDosageChange, nextDosageChange, PrescriptionFormActions,
} from './actions';
import { IPrescriptionFormContext, PrescriptionFormState } from './types';
import { Drug, DrugForm } from '../../types';
import { CLEAR_SCHEDULE, REMOVE_DRUG_FORM } from '../../redux/actions/taperConfig';
import TotalQuantities from '../TotalQuantities';

const { Option } = Select;

export const PrescriptionFormContext = createContext<IPrescriptionFormContext>({
  ...initialState,
  Current: { dosages: initialState.currentDosagesQty, action: currentDosageChange },
  Next: { dosages: initialState.nextDosagesQty, action: nextDosageChange },
  dispatch: () => {
  },
  id: -1,
});

interface Props {
  id: number;
  drugs: Drug[];
}

const PrescriptionForm: FC<Props> = ({ id, drugs }) => {
  const globalDispatch = useDispatch();
  const [state, localDispatch] = useReducer<PrescriptionFormReducer, PrescriptionFormState>(reducer, initialState, (init) => initialState, `PrescriptionFormReducer_${id}`);
  const dispatch = (action: PrescriptionFormActions) => {
    globalDispatch(action);
    localDispatch(action);
  };

  const {
    chosenDrug,
    chosenBrand,
    brandOptions,
    chosenDrugForm,
    drugFormOptions,
    currentDosagesQty,
    nextDosagesQty,
    intervalStartDate,
    intervalEndDate,
  } = state;

  const [showTotalQuantities, setShowTotalQuantities] = useState(false, `PrescriptionForm-ShowTotalQuantities_${id}`);

  useEffect(() => {
    dispatch({
      type: FETCH_DRUGS,
      data: drugs,
    });
  }, [drugs]);

  useEffect(() => {
    setShowTotalQuantities(
      ![chosenDrug, chosenBrand, chosenDrugForm,
        intervalStartDate, intervalEndDate].some((el) => el === null),
    );
  }, [chosenDrug, chosenBrand, chosenDrugForm, intervalStartDate, intervalEndDate]);

  const onSubmit = () => {
  };

  const onDrugNameChange = (value: string) => {
    dispatch({
      type: DRUG_NAME_CHANGE,
      data: { id, name: value },
    });
  };

  const onBrandChange = (value: string) => {
    dispatch({
      type: CHOOSE_BRAND,
      data: { id, brand: value },
    });
  };

  const onFormChange = (value: string) => {
    dispatch({
      type: CHOOSE_FORM,
      data: { id, form: value },
    });
  };

  const removeDrugForm = () => {
    globalDispatch({
      type: REMOVE_DRUG_FORM,
      data: id,
    });
    globalDispatch({
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
      dispatch,
    }}
    >
      <Button onClick={removeDrugForm}>Remove</Button>
      <form onSubmit={onSubmit}>
        <h3>Drug Name</h3>
        <Select defaultValue="" value={chosenDrug?.name} onChange={onDrugNameChange} style={{ width: 200 }}>
          {drugs.map((drug) => <Option key={drug.name} value={drug.name}>{drug.name}</Option>)}
        </Select>

        <h3>Prescription settings</h3>
        <label>Brand</label>
        <Select defaultValue="" value={chosenBrand?.brand} onChange={onBrandChange} style={{ width: 200 }}>
          {brandOptions?.map(
            (brand) => <Option key={brand.brand} value={brand.brand}>{brand.brand}</Option>,
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
        <hr />

        <SelectInterval />
        <hr/>
        {showTotalQuantities && <TotalQuantities/>}
      </form>
      <hr />
    </PrescriptionFormContext.Provider>
  );
};
export default PrescriptionForm;
