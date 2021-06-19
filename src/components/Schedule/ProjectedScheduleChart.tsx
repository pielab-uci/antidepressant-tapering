import * as React from 'react';
import {
  CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
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

const CustomizedAxisTick: FC<{ x: number, y: number, stroke: string, payload: { value: Date } }> = ({
  x, y, stroke, payload,
}) => {
  return (
  <g transform={`translate(${x}, ${y})`}>
    <text x={0} y={0} dy={16} textAnchor='end' fill='#666' transform='rotate(-35)'>
      {format(payload.value, 'MM-dd')}
    </text>
  </g>
  );
};

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
    <ResponsiveContainer width={width} height={height}>
      <LineChart data={scheduleChartData}>
        <CartesianGrid strokeDasharray="3 3"/>
        <XAxis height={60} dataKey="timestamp" type="number" tick={(props) => <CustomizedAxisTick {...props}/>} tickFormatter={(time) => format(time, 'MM-dd')}
               domain={['auto', 'auto']} scale="time"/>
        {/* <XAxis dataKey="timestamp" type="number" tickFormatter={(time) => format(time, 'MM-dd')} */}
        {/*       domain={['auto', 'auto']} scale="time"/> */}
        <YAxis dataKey="dosage"/>
        <Tooltip formatter={(value: number) => `${value}mg`} labelFormatter={(time: number) => format(time, 'MM-dd')}/>
        <Legend/>
        {scheduleChartData.map((drug) => (
          <Line dataKey="dosage" data={drug.data} name={drug.name} key={drug.name} type={'stepAfter'}
                stroke={lineColors.current[drug.name]}/>
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ProjectedScheduleChart;
