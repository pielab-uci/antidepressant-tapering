import * as React from 'react';
import NavBar from '../components/NavBar';
import PatientsList from "../components/PatientsList";
import {useEffect} from "react";

const HomePage = () => {
  return (
    <>
      <div>Home</div>
      <NavBar/>
      <PatientsList />
      <button>New Patient</button>
    </>
  )
}

export default HomePage;
