import * as React from 'react';
import { css } from '@emotion/react';
import { useHistory, useLocation } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import {
  HelpIcon, LogOutIcon, PatientsMenuIcon, SymptomTemplatesMenuIcon,
} from '../icons';

const NavBar = () => {
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    // console.group('NavBar');
    // console.log('location: ', location);
    // console.groupEnd();
  });

  const TabStyle = (name: 'patient' | 'symptomTemplates') => css`
    height: 68px;
    display: flex;
    margin-top: 35px;
    padding-left: 29px;
    align-items: ${name === 'patient' ? 'center' : 'start'};
    background-color: #0984E3;
    color: white;

    & > div {
      margin-left: 14px;
    }

    ${((name === 'patient' && location.pathname.match(/(\/)|(\/patient.+)|(\/taper-configuration.+)/) !== null)
            || (name === 'symptomTemplates' && location.pathname.match(/\/symptom-templates.+/)) !== null)
    && css`
      background-color: white;
      color: #0984E3;
      border-top-left-radius: 17px;
      border-right: 1px solid #0984E3;
      border-bottom-left-radius: 17px;`
}`;

  const subMenuStyle = css`
    background-color: white;
    margin: 6px 0 0 39px;
    color: #0984E3;
    font-size: 16px;
    padding: 5px 0 5px 28px;
    height: 131px;
    border-top-left-radius: 17px;
    border-bottom-left-radius: 17px;
    border-right: 1px solid #0984E3;
    display: ${location.pathname.match(/(\/patient.+)|(\/taper-configuration.+)/) === null
    ? 'none'
    : 'flex'};

    flex-direction: column;
    justify-content: center;

    & > div {
      flex: 1;
      display: flex;
      align-items: center;
    }
  `;

  const NavBarStyle = css`
    background-color: #0984E3;
    border-top-right-radius: 17px;
    font-size: 24px;
    color: white;
    height: 100%;
    flex: 0 0 307px;
    margin-top: 52px;
    padding-top: 201px;
  `;

  const helpAndLogoutStyle = css`
    padding-left: 29px;
    display: flex;
    flex-direction: column;
    margin: auto 0 19px 0;
    & > div {
      display: flex;
      margin-bottom: 42px;
    }

    & > div > div {
      margin-left: 14px;
    }`;
  // const boldOnRoute = (path: string, boldUrl: string) => css`
  // font-weight: ${path.match(boldUrl) ? 'bold' : 'normal'}
  // `;

  return (
    <div css={NavBarStyle}>
      <div css={css`margin-left: 17px;
        height: 100%;
        display: flex;
        flex-direction: column;`}>
        <div>
          <div css={TabStyle('patient')}>
            <PatientsMenuIcon/>
            <div>Patients</div>
          </div>
          <div css={subMenuStyle}>
            <div>Medication schedule</div>
            <div>Symptom tracker</div>
            <div>Patient report</div>
          </div>
        </div>
        <div css={TabStyle('symptomTemplates')}>
          <SymptomTemplatesMenuIcon/>
          <div>Symptom Templates</div>
        </div>
        <div css={helpAndLogoutStyle}>
          <div>
            <HelpIcon/>
            <div>Help</div>
          </div>
          <div>
            <LogOutIcon/>
            <div>Log Out</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
