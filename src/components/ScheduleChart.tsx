import * as React from 'react';
import {
  CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { useSelector } from 'react-redux';
import { TaperConfigState } from '../redux/reducers/taperConfig';
import { RootState } from '../redux/reducers';

const ScheduleChart = () => {
  const { scheduleChartData } = useSelector<RootState, TaperConfigState>((state) => state.taperConfig);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart width={300} height={300}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" type="category" allowDuplicatedCategory={false} />
        <YAxis dataKey="dosage" />
        <Tooltip />
        <Legend />
        {scheduleChartData.map((drug) => (
          <Line dataKey="dosage" data={drug.data} name={drug.name} key={drug.name} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ScheduleChart;
