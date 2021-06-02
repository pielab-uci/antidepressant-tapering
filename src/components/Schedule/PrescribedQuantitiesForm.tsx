import {
  FC, useCallback, useContext, useEffect, useMemo, useRef,
} from 'react';
import * as React from 'react';
import { Input } from 'antd';
import { TableRowData } from '../../redux/reducers/utils';
import { isCapsuleOrTablet, PrescribedDrug } from '../../types';
import { ProjectedScheduleContext } from './ProjectedSchedule';

interface Props {
  prescribedDrug: PrescribedDrug,
  prescribedDosages: { [dosage: string]: number } | null,
  rows: TableRowData[],
}

// TODO: check and make sure that rows correspond to the prescribedDrug in the props
const PrescribedQuantitiesForm: FC<Props> = ({ prescribedDrug, rows, prescribedDosages }) => {
  const brand = useRef<string>(rows[0].brand);
  const drugName = useRef<string>(rows[0].drug);
  const form = useRef<string>(rows[0].form);
  const { gridApi } = useContext(ProjectedScheduleContext);
  // const prescribedDosages: () => { [dosage: string]: number } | null = () => {
  //   if (gridApi === null) {
  //     return null;
  //   }
  //   const result = gridApi.getSelectedNodes()
  //     .reduce((prev, row) => {
  //       Object.entries(row.data.prescribedDosages as { [dosage: string]: number }).forEach(([dosage, qty]) => {
  //         if (!prev[dosage]) {
  //           prev[dosage] = qty;
  //         } else {
  //           prev[dosage] += qty;
  //         }
  //       });
  //       return prev;
  //     }, {} as { [dosage: string]: number });
  //   console.log('PrescribedQuantitiesForDrug:prescribedDosages: ', result);
  //   return result;
  // };
  const qtyOrZero = useCallback((prescribedDosages: { [dosage: string]: number }, dosage: string): number => {
    return prescribedDosages[dosage] ? prescribedDosages[dosage] * prescribedDrug.intervalDurationDays : 0;
  }, []);

  const renderOptions = (prescribedDosages: { [dosage: string]: number }| null) => {
    if (prescribedDosages === null) {
      return null;
    }

    return Object.keys(prescribedDosages).map((dosage) => (
      <div key={`${prescribedDrug.id}_${brand}_${form}_${dosage}`}>
        <h5>{dosage}:</h5>
        <Input title={dosage}
               style={{ display: 'inline-block' }}
               type='number'
               min={0}
               defaultValue={qtyOrZero(prescribedDosages, dosage)}
               value={prescribedDosages[dosage]}
               step={0.5}
               width={'50px'}
               readOnly/>
      </div>
    ));
  };
  // const renderOptions = (options: string[]) => {
  //   if (prescribedDosages === null) {
  //     return null;
  //   }
  //   return options.map((option) => (
  //     <div key={`${prescribedDrug.id}_${brand}_${form}_${option}`}>
  //       <h5>{option}:</h5>
  //       <Input title={option}
  //              style={{ display: 'inline-block' }}
  //              type='number'
  //              min={0}
  //              defaultValue={qtyOrZero(prescribedDosages, option)}
  //              value={prescribedDosages[option]}
  //              step={0.5}
  //              width={'50px'}
  //              readOnly/>
  //     </div>
  //   ));
  // };

  const renderQuantities = () => {
    // if (isCapsuleOrTablet(prescribedDrug)) {
    //   return renderOptions(prescribedDrug.regularDosageOptions!);
    // }
    // return renderOptions(prescribedDrug.oralDosageInfo!.bottles);
    return renderOptions(prescribedDosages);
  };

  return (
    <>
      <h4>{brand.current} ({drugName.current}) {form.current}</h4>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {renderQuantities()}
      </div>
    </>
  );
};

export default PrescribedQuantitiesForm;
