import * as React from 'react';
import { css } from '@emotion/react';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  HelpIcon, LogOutIcon, PatientsMenuIcon, SymptomTemplatesMenuIcon,
} from '../icons';

const NavBarStyle = css`
  background-color: #0984E3;
  border-top-right-radius: 17px;
  //font-size: 24px;
  font-size: 1rem;
  color: white;
  height: 100%;
  //width: 16%;
  //flex: 0 0 200px;
  flex: 0 0 16%;
  padding-top: 3%;
`;

const helpAndLogoutStyle = css`
  padding-left: 29px;
  display: flex;
  flex-direction: column;
  margin: auto 0 19px 0;

  & > div {
    display: flex;
    padding-bottom: 20px;
    align-items: center;
  }

  & > div > div {
    margin-left: 14px;
  }`;

const NavBar = () => {
  const location = useLocation();
  const [currentMenu, setCurrentMenu] = useState<'schedule' | 'symptomTracker' | 'report'>('schedule');

  useEffect(() => {
    if (location.pathname.includes('symptom-tracker')) {
      setCurrentMenu('symptomTracker');
    } else if (location.pathname.includes('report')) {
      setCurrentMenu('report');
    } else {
      setCurrentMenu('schedule');
    }
  }, [location]);

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
    font-size: 0.8rem;
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

  const boldOnRoute = (menu: 'schedule' | 'symptomTracker' | 'report') => css`
    font-weight: ${menu === currentMenu ? 'bold' : 'normal'}
  `;

  return (
    <div css={NavBarStyle}>
      <div css={css`
        //margin-left: 17px;
        margin-left: 5%;
        height: 100%;
        display: flex;
        flex-direction: column;`}>
        <div>
          <div css={TabStyle('patient')}>
            <PatientsMenuIcon/>
            <div>Patients</div>
          </div>
          <div css={subMenuStyle}>
            <div css={boldOnRoute('schedule')}>Medication schedule</div>
            <div css={boldOnRoute('symptomTracker')}>Symptom tracker</div>
            <div css={boldOnRoute('report')}>Patient report</div>
          </div>
        </div>
        <div css={TabStyle('symptomTemplates')}>
          <div>
            <SymptomTemplatesMenuIcon/>
          </div>
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
