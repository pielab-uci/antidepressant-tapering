import * as React from 'react';
import {
  CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import format from 'date-fns/format';
import { FC, useMemo, useRef } from 'react';
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

  const lineColors: string[] = useMemo(() => {
    if (scheduleChartData.length === 1) {
      return ['#FFEAA7'];
    }

    const changeDirections: ['increase' | 'decrease' | 'same', 'increase' | 'decrease' | 'same'] = scheduleChartData.map((d) => d.changeDirection) as ['increase' | 'decrease' | 'same', 'increase' | 'decrease' | 'same'];

    if (changeDirections[0] === 'increase') {
      return ['#FFEAA7', '#74B9FF'];
    }

    if (changeDirections[0] === 'decrease') {
      return ['#74B9FF', '#FFEAA7'];
    }
    if (changeDirections[1] === 'increase') {
      return ['#74B9FF', '#FFEAA7'];
    }
    return ['#FFEAA7', '#74B9FF'];
  }, [scheduleChartData]);

  return (
    <ResponsiveContainer width={width} height={height}>
      <LineChart data={scheduleChartData}>
        <CartesianGrid strokeDasharray="3 3"/>
        <XAxis height={60} dataKey="timestamp" type="number" tick={(props) => <CustomizedAxisTick {...props}/>}
               tickFormatter={(time) => format(time, 'MM-dd')}
               domain={['auto', 'auto']} scale="time"/>
        <YAxis dataKey="dosage"/>
        <Tooltip formatter={(value: number) => `${value}mg`} labelFormatter={(time: number) => format(time, 'MM-dd')}/>
        <Legend/>
        {scheduleChartData.map((drug, i) => (
          <Line dataKey="dosage" data={drug.data} name={drug.name} key={drug.name} type={'stepAfter'}
                stroke={lineColors[i]}/>
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ProjectedScheduleChart;
