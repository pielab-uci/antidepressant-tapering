import * as React from 'react';
import {FC} from "react";
import Tablet from "./Tablet";

interface Props {
  title: string;
  dosages: string[];
  onChange: (dosage: object) => void;
}

const Dosages: FC<Props> = ({title, dosages, onChange}) => {
  return (
    <>
      <div>{title}</div>
      {dosages.map(v => <Tablet />)}
    </>
  )
}

export default Dosages;
