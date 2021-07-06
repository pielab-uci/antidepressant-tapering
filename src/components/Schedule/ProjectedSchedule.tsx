import * as React from 'react';
import { useSelector } from 'react-redux';
import {
  FC,
} from 'react';
import { css } from '@emotion/react';
import { ProjectedScheduleChart, ProjectedScheduleTable } from '.';
import { RootState } from '../../redux/reducers';
import { TaperConfigState } from '../../redux/reducers/taperConfig/taperConfig';
import { PrescribedDrug, TableRowData } from '../../types';
import PrescribedQuantitiesForDrug from './PrescribedQuantitiesForDrug';

export interface Schedule {
  drugs: PrescribedDrug[];
  data: TableRowData[];
}

const ProjectedSchedule: FC<{ editable: boolean, title: string }> = ({ editable, title }) => {
  const {
    projectedSchedule, scheduleChartData, finalPrescription,
  } = useSelector<RootState, TaperConfigState>((state) => state.taperConfig);

  return (
    <>
      {projectedSchedule.data.length
        ? <>
          {/* <h3 css={css`font-size: 18px; */}
          <h3 css={css`font-size: 1.1rem;
            color: #636E72;`}>{title}</h3>
          <p>Check all the rows that you would like to prescribe.</p>
          <div css={css`display: flex;
            justify-content: space-between;`}>
            {projectedSchedule.data.length !== 0
            && <div css={css`flex: 3;`}><ProjectedScheduleTable editable={editable} projectedSchedule={projectedSchedule}/>
            </div>}
            <div>
              <ProjectedScheduleChart scheduleChartData={scheduleChartData} width={400} height={400}/>
            </div>
          </div>
          <h3 css={css`font-size: 18px;
            margin-top: 33px;`}>Prescription for upcoming intervals</h3>
          {Object.entries(finalPrescription).map(([id, prescription]) => {
            return <PrescribedQuantitiesForDrug
              key={`PrescribedQuantitiesFor${id}`} id={parseFloat(id)} prescription={prescription}
              editable={editable}/>;
          })}

        </> : <div>No schedule yet</div>
      }
    </>
  );
};
export default ProjectedSchedule;
