import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import Input from 'antd/es/input';
import { css } from '@emotion/react';
import Button from 'antd/es/button';
import { LOGIN_REQUEST, LoginRequestAction } from '../redux/actions/user';

const LoginPage = () => {
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();

  // const onSubmit = (data: { email: string; password: string }) => {
  const onSubmit = (data: { name: string }) => {
    dispatch<LoginRequestAction>({
      type: LOGIN_REQUEST,
      data,
    });
  };
  return (
    <div css={css`display: flex;
      height: 100%;
      flex-direction: column;
      justify-content: center;`}>
        <div css={css`background-color: #0984E3;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 30%;
        `}>
          <form css={css`width: 30%; transform: translateY(-10px)`} onSubmit={handleSubmit(onSubmit)}>
            <h1 css={css`color: white;`}>AT Planner</h1>
            <h3 css={css`color: white; margin-left: 5px;`}>Sign In</h3>
            {/* <input type="email" {...register('email', { required: true })} placeholder="Email address" /> */}
            {/* <input type="password" {...register('password', { required: true })} placeholder="password" /> */}
            <div css={css`display: flex;`}>
              <Input {...register('name', { required: true })} placeholder={'Please enter your name to sign in.'} />
              <Button css={css`margin-left: 5px;`} htmlType='submit'>Sign In</Button>
            </div>
          </form>
      </div>
    </div>
  );
};

export default LoginPage;
