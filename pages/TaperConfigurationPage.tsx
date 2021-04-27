import * as React from 'react';
import {useCallback, useEffect, useState} from "react";
import PrescriptionForm from "../components/PrescriptionForm";

const TaperConfigurationPage = () => {
  const [currentDosage, setCurrentDosage] = useState({});
  // need to decide the type of prescription form / tapering configuration
  const [prescriptionForms, setPrescriptionForms]= useState<string[]>([]);

  useEffect(() => {
    // load drug info and save to the store
  }, []);

  const addPrescriptionForm = useCallback(() => {
    setPrescriptionForms(prev => [...prev, 'new one'])
  }, []);

  return (
    <>

      <PrescriptionForm/>
      <button onClick={addPrescriptionForm}>Add Drug</button>

      <h3>Share with Patient</h3>
      <textarea/>
      <button>App</button>
      <button>Email</button>
      <button>Text File</button>
    </>
  )
}

export default TaperConfigurationPage;
