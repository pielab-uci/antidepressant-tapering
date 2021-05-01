import * as React from 'react';
import {useMemo} from 'react';
import {RootState} from "../redux/reducers";
import {useSelector} from "react-redux";
import {TaperConfigState} from "../redux/reducers/taperConfig";
import {Column, useTable} from 'react-table';

export interface TableRow {
  Drug: string;
  'Current Dosage': string;
  'Next Dosage': string;
  Dates: string;
}

const ProjectedScheduleTable = () => {
  const columns: Column<TableRow>[] = useMemo(() => [
    {Header: 'Drug', accessor: 'Drug' as keyof TableRow},
    {Header: 'Current Dosage', accessor: 'Current Dosage' as keyof TableRow},
    {Header: 'Next Dosage', accessor: 'Next Dosage' as keyof TableRow},
    {Header: 'Dates', accessor: 'Dates' as keyof TableRow}], []);

  const {scheduleTableData} = useSelector<RootState, TaperConfigState>(state => state.taperConfig);

  const tableInstance = useTable<TableRow>({columns, data: scheduleTableData});
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow} = tableInstance;

  return (
    <table {...getTableProps()}>
      <thead>
      {headerGroups.map(headerGroup => (
        <tr {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map(column => (
            <th {...column.getHeaderProps()}>
              {column.render('Header')}
            </th>
          ))}
        </tr>
      ))}
      </thead>
      <tbody {...getTableBodyProps()}>
      {rows.map(row => {
        prepareRow(row);
        return (
          <tr {...row.getRowProps()}>
            {row.cells.map(cell => (
              <td {...cell.getCellProps()}>
                {cell.render('Cell')}
              </td>
            ))}
          </tr>
        )
      })}
      </tbody>
    </table>
  )
}

export default ProjectedScheduleTable;
