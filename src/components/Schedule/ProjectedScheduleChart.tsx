import * as React from 'react';
import {
  CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import format from 'date-fns/format';
import { FC, useMemo, useRef } from 'react';
import rgbHex from 'rgb-hex';
import { css } from '@emotion/react';
import { ScheduleChartData } from '../../redux/reducers/utils';

interface Props {
  scheduleChartData: ScheduleChartData;
  width: number;
  height: number;
}

const CustomizedAxisTick: FC<{ x: number, y: number, stroke: string, payload: { value: Date } }> = ({
  x,
  y,
  stroke,
  payload,
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
    Citalopram: `#${rgbHex(232, 67, 147)}`,
    Sertraline: `#${rgbHex(9, 132, 195)}`,
    Paroxetine: `#${rgbHex(108, 72, 247)}`,
    Escitalopram: `#${rgbHex(255, 117, 117)}`,
  });

  return (
      <LineChart data={scheduleChartData} width={width + 300} height={height}>
        <CartesianGrid strokeDasharray="3 3"/>
        <XAxis height={50} dataKey="timestamp" type="number" tick={(props) => <CustomizedAxisTick {...props}/>}
               tickFormatter={(time) => format(time, 'MM-dd')}
               domain={['auto', 'auto']} scale="time"/>
        <Legend chartWidth={width} width={300} layout='vertical' verticalAlign='middle' align='right' wrapperStyle={{ paddingLeft: '20px' }}/>
        <YAxis dataKey="dosage"/>
        <Tooltip formatter={(value: number) => `${value}mg`} labelFormatter={(time: number) => format(time, 'MM-dd')}/>
        {scheduleChartData.map((drug, i) => (
          <Line dataKey="dosage" data={drug.data} name={drug.brand} key={drug.brand} type={'stepAfter'}
                stroke={lineColors.current[drug.name]}/>
        ))}
      </LineChart>
  );
};

export default ProjectedScheduleChart;
