import * as React from 'react';
import Dosages from "../Dosages";
import SelectInterval from "../SelectInterval";
import {useEffect, createContext, FC} from "react";
import {useReducer} from 'reinspect'
import {Button, Select} from 'antd';

const {Option} = Select;
import {
  initialState,
  reducer,
  PrescriptionFormReducer
} from './reducer'
import {
  CHOOSE_BRAND, CHOOSE_FORM,
  DRUG_NAME_CHANGE, FETCH_DRUGS, currentDosageChange, nextDosageChange, PrescriptionFormActions
} from './actions'
import {IPrescriptionFormContext, PrescriptionFormState} from "./types";
import {Drug, DrugForm} from "../../types";
import {useDispatch} from "react-redux";
import {REMOVE_DRUG_FORM} from "../../redux/actions/taperConfig";


export const PrescriptionFormContext = createContext<IPrescriptionFormContext>({
  ...initialState,
  Current: {dosages: initialState.currentDosages, action: currentDosageChange},
  Next: {dosages: initialState.nextDosages, action: nextDosageChange},
  dispatch: () => {
  },
  id: -1,
});

interface Props {
  id: number;
  drugs: Drug[];
}

const PrescriptionForm: FC<Props> = ({id, drugs}) => {
  const globalDispatch = useDispatch();
  const [state, localDispatch] = useReducer<PrescriptionFormReducer, PrescriptionFormState>(reducer, initialState, init => initialState, `PrescriptionFormReducer_${id}`);
  const dispatch = (action: PrescriptionFormActions) => {
    globalDispatch(action);
    localDispatch(action);
  }

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
      data: {id, name: value},
    });
  }

  const onBrandChange = (value: string) => {
    dispatch({
      type: CHOOSE_BRAND,
      data: { id, brand: value }
    });
  }

  const onFormChange = (value: string) => {
    dispatch({
      type: CHOOSE_FORM,
      data: { id, form: value},
    });
  }

  const removeDrugForm = () => {
    globalDispatch({
      type: REMOVE_DRUG_FORM,
      data: id,
    })
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
      ...state,
      id,
      Current: {dosages: currentDosages, action: currentDosageChange},
      Next: {dosages: nextDosages, action: nextDosageChange},
      dispatch
    }}>
      <Button onClick={removeDrugForm}>Remove</Button>
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
      <hr/>
    </PrescriptionFormContext.Provider>
  )
}
export default PrescriptionForm;
