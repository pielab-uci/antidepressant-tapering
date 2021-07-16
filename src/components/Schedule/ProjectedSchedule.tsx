import * as React from 'react';
import { useSelector } from 'react-redux';
import {
  FC,
} from 'react';
import { css } from '@emotion/react';
import { ProjectedScheduleChart, ProjectedScheduleTable } from '.';
import { RootState } from '../../redux/reducers';
import { TaperConfigState } from '../../redux/reducers/taperConfig';
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

  const renderColorSamples = () => {
    const drugs = ['F', 'C', ' S', 'P', 'E'];
    return (
      <div css={css`width: 400px;
        height: 200px;
        display: flex;
        flex-direction: row;`}>
        {['#00B894', '#E84393', '#0984C3', '#6C48F7', '#FF7575'].map((bgc, i) => (
          <div key={i} css={css`width: 20%;
            display: flex;
            flex-direction: column;`}>
            <div css={css`height: 50%;
              background-color: ${bgc};
              opacity: 0.5;
              color: black;`}>{drugs[i]}</div>
            <div css={css`height: 50%;
              background-color: ${bgc};
              opacity: 0.2;
              color: black;`}>{drugs[i]}</div>
          </div>))}
      </div>
    );
  };
  return (
    <>
      {projectedSchedule.data.length
        ? <>
          {/* <h3 css={css`font-size: 18px; */}
          <h3 css={css`font-size: 1.1rem;
            color: #636E72;`}>{title}</h3>
          <p>Check all the rows that you would like to prescribe.</p>
          {/* {renderColorSamples()} */}
          <div css={css`display: flex;
            //justify-content: space-between;
            flex-direction: column;`}>

            {projectedSchedule.data.length !== 0
            // && <div css={css`flex: 3;`}>
            && <div>
              <ProjectedScheduleTable editable={editable} projectedSchedule={projectedSchedule}/>
            </div>}
            <div>
              <div css={css`margin: 25px 0;`}>
                <ProjectedScheduleChart scheduleChartData={scheduleChartData} width={400} height={400}/>
              </div>
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
