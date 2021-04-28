import * as React from 'react';
import Dosages from "../Dosages";
import SelectInterval from "../SelectInterval";
import {Reducer, useCallback, useEffect, useReducer} from "react";
import {useSelector} from "react-redux";
import {TaperConfigState} from "../../redux/reducers/taperConfig";
import {RootState} from "../../redux/reducers";
import {Drug, DrugOption} from "../../types";
import {Select} from 'antd';

const {Option} = Select;
import {
  CHOOSE_BRAND, CHOOSE_FORM,
  DRUG_NAME_CHANGE, FETCH_DRUGS,
  initialState, PrescriptionFormActions,
  reducer
} from './reducer'

export interface PrescriptionFormState {
  chosenDrug: Drug | undefined | null;
  chosenBrand: DrugOption | null;
  chosenDrugForm: { form: string, dosages: string[] } | null | undefined;
  brandOptions: DrugOption[] | null;
  drugFormOptions: { form: string, dosages: string[] }[] | null;
  dosageOptions: string[];
  currentDosages: object;
  nextDosages: object;
  drugs: Drug[] | null;
}

const PrescriptionForm = () => {
  const {drugs} = useSelector<RootState, TaperConfigState>(state => state.taperConfig);
  const [state, dispatch] = useReducer<Reducer<PrescriptionFormState, PrescriptionFormActions>>(reducer, initialState);
  const {chosenDrug, chosenBrand, brandOptions, chosenDrugForm, drugFormOptions, dosageOptions} = state;

  useEffect(() => {
    dispatch({
      type: FETCH_DRUGS,
      data: drugs
    })
  }, []);

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

  const onFormChange = (value: string) => {
    dispatch({
      type: CHOOSE_FORM,
      data: value,
    });
  }

  const onCurrentDosageChange = useCallback(() => {

  }, []);

  const onNextDosageChange = useCallback(() => {

  }, [])


  return (
    <>
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

        <Dosages title="Current Dosages" dosages={dosageOptions} onChange={onCurrentDosageChange}/>
        <Dosages title="Next Dosages" dosages={dosageOptions} onChange={onNextDosageChange}/>
        <hr/>

        <SelectInterval/>
      </form>
    </>
  )
}
export default PrescriptionForm;
