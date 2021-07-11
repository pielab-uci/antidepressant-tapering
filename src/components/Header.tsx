import * as React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { UserState } from '../redux/reducers/user';
import { RootState } from '../redux/reducers';
import JomhuriaWoff from '../assets/jomhuria-v12-latin-regular.woff';
import JomhuriaWoff2 from '../assets/jomhuria-v12-latin-regular.woff2';

const StyledHeader = styled.header`
  display: flex;
  //border: 1px solid blue;
  //height: 8%;
  height: 5%;
  align-items: center;
  width: 100%;
`;

const Logo = styled.div`
  /* jomhuria-regular - latin */
  @font-face {
    font-family: 'Jomhuria';
    font-style: normal;
    font-weight: 400;
    src: local(''),
    url(${JomhuriaWoff2}) format('woff2'), /* Chrome 26+, Opera 23+, Firefox 39+ */
    url(${JomhuriaWoff}) format('woff'); /* Chrome 6+, Firefox 3.6+, IE 9+, Safari 5.1+ */
  }
  
  //flex-basis: 16%;
  //width: 16%;
  //flex: 0 0 200px;
  flex: 0 1 16%;
  text-align: center;
  font-size: 3rem;
  font-family: 'Jomhuria';
  //font-weight: bold;
  margin: 0;
  color: #0984E3;

`;

const DisplayUser = styled.div`
  background-color: #0984E3;
  border-bottom-left-radius: 17px;
  text-align: right;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
  color: white;
  font-size: 1rem;
`;

const Header = () => {
  const { me } = useSelector<RootState, UserState>((state) => state.user);
  const history = useHistory();
  const onClickLogo = () => {
    history.push('/');
  };
  return (
    <>
      <StyledHeader>
        <Logo onClick={onClickLogo}>AT Planner</Logo>
        <DisplayUser>
          <span css={css`margin-right: 86px`}>Hello, Dr. {me?.name}</span>
        </DisplayUser>
      </StyledHeader></>
  );
};

export default Header;
