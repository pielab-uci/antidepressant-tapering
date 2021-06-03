import * as React from 'react';
import {
  FC, useContext, useEffect, useMemo, useState,
} from 'react';
import { useSelector } from 'react-redux';
import { TableRowData } from '../../redux/reducers/utils';
import PrescribedQuantitiesForm from './PrescribedQuantitiesForm';
import { PrescribedDrug } from '../../types';
import { ProjectedScheduleContext } from './ProjectedSchedule';
import { RootState } from '../../redux/reducers';
import { TaperConfigState } from '../../redux/reducers/taperConfig';

interface Props {
  // rows: TableRowData[];
  drug: PrescribedDrug;
}

interface RowsByForm {
  [form: string]: TableRowData[]
}

// refactor it into a function in the upper component
const PrescribedQuantitiesForDrug: FC<Props> = ({ drug }) => {
// const PrescribedQuantitiesForDrug: FC<Props> = ({ drug, rows }) => {
  const { gridApi } = useContext(ProjectedScheduleContext);
  const { projectedSchedule } = useSelector<RootState, TaperConfigState>((state) => state.taperConfig);
  const [prescribedDosages, setPrescribedDosages] = useState<{ [dosage: string]: number } | null>(null);

  // const prescribedDosages
  useEffect(() => {
    console.log('gridApi: ', gridApi);
    if (gridApi !== null) {
      const dosages = gridApi.getSelectedNodes()
        .reduce((prev, row) => {
          Object.entries(row.data.prescribedDosages as { [dosage: string]: number }).forEach(([dosage, qty]) => {
            if (!prev[dosage]) {
              prev[dosage] = qty;
            } else {
              prev[dosage] += qty;
            }
          });
          return prev;
        }, {} as { [dosage: string]: number });
      if (JSON.stringify(prescribedDosages) !== JSON.stringify(dosages)) {
        console.log('PrescribedQuantitiesForDrug prescribedDosages updated');
        setPrescribedDosages(dosages);
      }
    }
  }, [gridApi?.getSelectedNodes()]);

  const rowsByForm: RowsByForm = useMemo(() => projectedSchedule.data
    .filter((row) => row.prescribedDrugId === drug.id)
    .reduce((prev, row: TableRowData) => {
      if (!prev[row.form]) {
        prev[row.form] = [];
        prev[row.form].push(row);
      } else {
        prev[row.form].push(row);
      }
      return prev;
    }, {} as RowsByForm), [projectedSchedule]);

  return (
    <>
      {Object.keys(rowsByForm).map((form) => {
        return (
          <PrescribedQuantitiesForm
            key={`PrescribedQuantitiesForm_${form}`}
            prescribedDrug={drug}
            prescribedDosages={prescribedDosages}
            rows={rowsByForm[form]}/>
        );
      })}
    </>
  );
};

export default PrescribedQuantitiesForDrug;
