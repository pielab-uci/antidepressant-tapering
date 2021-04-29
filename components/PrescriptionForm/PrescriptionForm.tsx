import * as React from 'react';
import Dosages from "../Dosages";
import SelectInterval from "../SelectInterval";
import {useEffect, createContext} from "react";
import {useReducer} from 'reinspect'
import {useSelector} from "react-redux";
import {TaperConfigState} from "../../redux/reducers/taperConfig";
import {RootState} from "../../redux/reducers";
import {Select} from 'antd';

const {Option} = Select;
import {
  CHOOSE_BRAND, CHOOSE_FORM,
  DRUG_NAME_CHANGE, FETCH_DRUGS,
  initialState,
  reducer,
  currentDosageChange,
  nextDosageChange, PrescriptionFormReducer
} from './reducer'
import {IPrescriptionFormContext, PrescriptionFormState} from "./types";
import {DrugForm} from "../../types";


export const PrescriptionFormContext = createContext<IPrescriptionFormContext>({
  Current: {dosages: initialState.currentDosages, action: currentDosageChange},
  Next: {dosages: initialState.nextDosages, action: nextDosageChange},
  chosenDrugForm: initialState.chosenDrugForm,
  dosageOptions: initialState.dosageOptions,
  currentDosages: initialState.currentDosages,
  nextDosages: initialState.nextDosages,
  dispatch: () => {
  }
});

const PrescriptionForm = () => {
  const {drugs} = useSelector<RootState, TaperConfigState>(state => state.taperConfig);
  const [state, dispatch] = useReducer<PrescriptionFormReducer, PrescriptionFormState>(reducer, initialState, init => initialState, 'PrescriptionFormReducer');
  const {
    chosenDrug,
    chosenBrand,
    brandOptions,
    chosenDrugForm,
    drugFormOptions,
    dosageOptions,
    currentDosages,
    nextDosages
  } = state;

  useEffect(() => {
    dispatch({
      type: FETCH_DRUGS,
      data: drugs
    })
  }, [drugs]);

  const onSubmit = () => {
  }

  const onDrugNameChange = (value: string) => {
    dispatch({
      type: DRUG_NAME_CHANGE,
      data: value,
    });
  }

  const onBrandChange = (value: string) => {
    dispatch({
      type: CHOOSE_BRAND,
      data: value
    });
  }

  const onFormChange = async (value: string) => {
    await dispatch({
      type: CHOOSE_FORM,
      data: value,
    });
  }

  const renderDosages = (chosenDrugForm: DrugForm | null | undefined, time: "Current" | "Next", dosages: { [key: string]: number }) => {
    return (
      <>
        {chosenDrugForm ? <Dosages time={time} dosages={dosages}/> : <div>No drug form selected</div>}
      </>
    )
  }

  return (
    <PrescriptionFormContext.Provider value={{
      Current: {dosages: currentDosages, action: currentDosageChange},
      Next: {dosages: nextDosages, action: nextDosageChange},
      currentDosages,
      nextDosages,
      chosenDrugForm,
      dosageOptions,
      dispatch
    }}>
      <form onSubmit={onSubmit}>
        <h3>Drug Name</h3>
        <Select defaultValue='' value={chosenDrug?.name} onChange={onDrugNameChange} style={{width: 200}}>
          {drugs.map(drug => <Option key={drug.name} value={drug.name}>{drug.name}</Option>)}
        </Select>

        <h3>Prescription settings</h3>
        <label>Brand</label>
        <Select defaultValue='' value={chosenBrand?.brand} onChange={onBrandChange} style={{width: 200}}>
          {brandOptions?.map(brand => <Option key={brand.brand} value={brand.brand}>{brand.brand}</Option>)}
        </Select>

        <label>Form</label>
        <Select defaultValue='' value={chosenDrugForm?.form} onChange={onFormChange} style={{width: 200}}>
          {drugFormOptions?.map(form => <Option key={form.form} value={form.form}>{form.form}</Option>)}
        </Select>
        <hr/>

        <div>Current Dosages</div>
        {renderDosages(chosenDrugForm, "Current", currentDosages)}
        <hr/>
        <div>Next Dosages</div>
        {renderDosages(chosenDrugForm, "Next", nextDosages)}
        <hr/>

        <SelectInterval/>
      </form>
    </PrescriptionFormContext.Provider>
  )
}
export default PrescriptionForm;
