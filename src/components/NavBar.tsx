import * as React from 'react';
import { css } from '@emotion/react';

const NavBar = () => (
  <div css={css`
  background-color:#0984E3;
  border-top-right-radius: 17px;
  height: 100%;
  flex: 0 0 307px;
  margin-top: 52px;
`}>
    <div>Patients</div>
    <div>Symptom Templates</div>
    <div>Help</div>
    <div>Log Out</div>
  </div>
);

export default NavBar;
