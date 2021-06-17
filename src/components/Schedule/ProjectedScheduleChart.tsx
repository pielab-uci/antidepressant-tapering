import * as React from 'react';
import {
  CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis,
} from 'recharts';
import { format } from 'date-fns';
import { FC, useRef } from 'react';
import rgbHex from 'rgb-hex';
import { ScheduleChartData } from '../../redux/reducers/utils';

interface Props {
  scheduleChartData: ScheduleChartData;
  width: number;
  height: number;
}
const ProjectedScheduleChart: FC<Props> = ({ scheduleChartData, width, height }) => {
  console.log('scheduleChartData');
  console.log(scheduleChartData);

  const lineColors = useRef<{ [drugName: string]: string }>({
    Fluoxetine: `#${rgbHex(0, 184, 148)}`,
    Citalopram: `#${rgbHex(0, 206, 201)}`,
    Sertraline: `#${rgbHex(9, 132, 195)}`,
    Paroxetine: `#${rgbHex(108, 72, 247)}`,
    Escitalopram: `#${rgbHex(255, 117, 117)}`,
  });

  return (
      <LineChart data={scheduleChartData} width={width} height={height}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="timestamp" type="number" tickFormatter={(time) => format(time, 'MM-dd')} domain={['auto', 'auto']} scale="time" />
        <YAxis dataKey="dosage" />
        <Tooltip formatter={(value: number) => `${value}mg`} labelFormatter={(time: number) => format(time, 'MM-dd')}/>
        <Legend />
        {scheduleChartData.map((drug) => (
          <Line dataKey="dosage" data={drug.data} name={drug.name} key={drug.name} type={'stepAfter'} stroke={lineColors.current[drug.name]}/>
        ))}
      </LineChart>
  );
};

export default ProjectedScheduleChart;
