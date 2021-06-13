import * as React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { GrNotification } from 'react-icons/gr';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { UserState } from '../redux/reducers/user';
import { RootState } from '../redux/reducers';

const StyledHeader = styled.header`
  display: flex;
  //border: 1px solid blue;
  width: 100%;`;

const Logo = styled.div`
  width: 307px;
  text-align: center;
  line-height: 70px;
  font-size: 26px;
  color: #0984E3;
  //border: 1px solid blue;
`;

const DisplayUser = styled.div`
  background-color: #0984E3;
  border-bottom-left-radius: 17px;
  text-align: right;
  height: 70px;
  line-height: 70px;
  flex: 1;
  //border: 1px solid blue;
  color: white;
  font-size: 23px;`;

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
        <span css={css`margin-right: 86px`}><GrNotification size={'23px'} css={css`margin-right: 41px;`}/>
        Hello, Dr. {me?.name}</span>
        </DisplayUser>
      </StyledHeader></>
  );
};

export default Header;
