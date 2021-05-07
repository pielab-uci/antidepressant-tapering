import * as React from 'react';
import {
  CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { TaperConfigState } from '../redux/reducers/taperConfig';
import { RootState } from '../redux/reducers';

const ScheduleChart = () => {
  const { scheduleChartData } = useSelector<RootState, TaperConfigState>((state) => state.taperConfig);
  console.log('scheduleChartData');
  console.log(scheduleChartData);
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={scheduleChartData} width={300} height={300}>
        <CartesianGrid strokeDasharray="3 3" />
        {/* <XAxis dataKey="time" type="category" allowDuplicatedCategory={false} /> */}
        <XAxis dataKey="timestamp" type="number" tickFormatter={(time) => format(time, 'MM-dd')} domain={['auto', 'auto']} scale="time" />
        <YAxis dataKey="dosage" />
        <Tooltip labelFormatter={(time: number) => format(time, 'MM-dd')}/>
        <Legend />
        {scheduleChartData.map((drug) => (
          <Line dataKey="dosage" data={drug.data} name={drug.name} key={drug.name} type={'stepAfter'}/>
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ScheduleChart;
