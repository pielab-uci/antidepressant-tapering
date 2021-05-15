import * as React from 'react';
import {
  CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { format } from 'date-fns';
import { FC } from 'react';
import { ScheduleChartData } from '../redux/reducers/utils';

interface Props {
  scheduleChartData: ScheduleChartData
}
const ScheduleChart: FC<Props> = ({ scheduleChartData }) => {
  // const { scheduleChartData } = useSelector<RootState, TaperConfigState>((state) => state.taperConfig);
  console.log('scheduleChartData');
  console.log(scheduleChartData);
  return (
    // <ResponsiveContainer width="100%" height="100%">
    <ResponsiveContainer width={300} height={300}>
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
