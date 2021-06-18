import * as React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { UserState } from '../redux/reducers/user';
import { RootState } from '../redux/reducers';

const StyledHeader = styled.header`
  display: flex;
  //border: 1px solid blue;
  height: 8%;
  align-items: center;
  width: 100%;
`;

const Logo = styled.div`
  //flex-basis: 16%;
  //width: 16%;
  //flex: 0 0 200px;
  flex: 0 1 16%;
  text-align: center;
  font-size: 1.5rem;
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
        <Logo onClick={onClickLogo}>Logo</Logo>
        <DisplayUser>
          <span css={css`margin-right: 86px`}>Hello, Dr. {me?.name}</span>
        </DisplayUser>
      </StyledHeader></>
  );
};

export default Header;
