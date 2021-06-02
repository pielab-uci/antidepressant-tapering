import * as React from 'react';
import { FC, useMemo } from 'react';
import { Schedule } from './ProjectedSchedule';
import { TableRowData } from '../../redux/reducers/utils';
import PrescribedQuantitiesForDrug from './PrescribedQuantitiesForDrug';

interface Props {
  projectedSchedule: Schedule
}

interface RowsByBrand {
  [drugBrand: string]: TableRowData[]
}

const PrescribedQuantitiesForDrugs: FC<Props> = ({ projectedSchedule }) => {
  // TODO: couple total quantities and table row/ prescribed drug using id/prescribedDrugId? Or using drug name..?
  // use name considering the case where a user add same drug multiple times with different interval
  const drugBrands: string[] = useMemo(() => projectedSchedule.drugs.map((drug) => drug.brand), [projectedSchedule]);
  const tableRowsByName: RowsByBrand = useMemo(
    () => projectedSchedule
      .data
      .reduce((prev: RowsByBrand, row: TableRowData) => {
        if (!prev[row.brand]) {
          prev[row.brand] = [];
          prev[row.brand].push(row);
        } else {
          prev[row.brand].push(row);
        }
        return prev;
      }, {} as RowsByBrand), [projectedSchedule],
  );

  return (
    <div>
      <h3>Prescription for Upcoming intervals</h3>
      {projectedSchedule.drugs
        .map((drug) => {
          return (
          <PrescribedQuantitiesForDrug
            key={`PrescribedQuantitiesForDrug_${drug.name}_${drug.brand}`}
            // rows={projectedSchedule.data.filter((row) => row.prescribedDrugId === drug.id)}
            drug={drug}/>
          );
        })}
    </div>
  );
};

export default PrescribedQuantitiesForDrugs;
