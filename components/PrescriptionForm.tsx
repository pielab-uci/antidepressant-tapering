import * as React from 'react';
import SelectForm from "./SelectForm";
import Dosages from "./Dosages";
import SelectInterval from "./SelectInterval";
import {useCallback} from "react";

const PrescriptionForm = () => {
  const onSubmit = () => {
  }

  const onCurrentDosageChange = useCallback(() => {

  }, []);

  const onNextDosageChange = useCallback(() => {

  }, [])

  const onDrugNameChange = useCallback(() => {

  }, [])

  const onBrandChange = useCallback(() => {

  }, []);

  const onFormChange = useCallback(() => {

  }, []);

  return (
    <>
      <form onSubmit={onSubmit}>
        <h3>Drug Name</h3>
        <SelectForm title="Drug Name" options={['drug1', 'drug2', 'drug3']} info={'info'} onChange={() => {
        }}/>

        <h3>Prescription settings</h3>
        <SelectForm title="Brand" options={["brand1", "brand2", "brand3"]} onChange={() => {
        }}/>
        <SelectForm title="Form" options={['form1', 'form2', 'form3']} onChange={() => {
        }}/>

        <Dosages title="Current Dosages" dosages={['5mg', '10mg', '20mg']} onChange={onCurrentDosageChange}/>
        <Dosages title="Next Dosages" dosages={['5mg', '10mg', '20mg']} onChange={onNextDosageChange}/>

        <SelectInterval/>
      </form>
    </>
  )
}
export default PrescriptionForm;
