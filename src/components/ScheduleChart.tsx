import * as React from 'react';
import {
  CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { format } from 'date-fns';
import { FC } from 'react';
import { ScheduleChartData } from '../redux/reducers/utils';

interface Props {
  scheduleChartData: ScheduleChartData;
  width: number;
  height: number;
}
const ScheduleChart: FC<Props> = ({ scheduleChartData, width, height }) => {
  // const { scheduleChartData } = useSelector<RootState, TaperConfigState>((state) => state.taperConfig);
  console.log('scheduleChartData');
  console.log(scheduleChartData);
  return (
    // <ResponsiveContainer width="100%" height="100%">
    <ResponsiveContainer width={width} height={height}>
      <LineChart data={scheduleChartData} width={width} height={height}>
        <CartesianGrid strokeDasharray="3 3" />
        {/* <XAxis dataKey="time" type="category" allowDuplicatedCategory={false} /> */}
        <XAxis dataKey="timestamp" type="number" tickFormatter={(time) => format(time, 'MM-dd')} domain={['auto', 'auto']} scale="time" />
        <YAxis dataKey="dosage" />
        <Tooltip formatter={(value: number) => `${value}mg`} labelFormatter={(time: number) => format(time, 'MM-dd')}/>
        <Legend />
        {scheduleChartData.map((drug) => (
          <Line dataKey="dosage" data={drug.data} name={drug.name} key={drug.name} type={'stepAfter'}/>
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ScheduleChart;
