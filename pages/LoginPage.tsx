import * as React from 'react';
import { useForm } from 'react-hook-form';
import {useDispatch} from "react-redux";
import {LOGIN_REQUEST, LoginRequestAction} from "../redux/actions/user";

const LoginPage = () => {
  const { register, handleSubmit} = useForm();
  const dispatch = useDispatch();
  const onSubmit = (data: { email: string; password: string}) => {
    dispatch<LoginRequestAction>({
      type: LOGIN_REQUEST,
      data,
    })
  }
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="email" {...register("email", { required: true})} placeholder="Email address"/>
        <input type="password" {...register("password", { required: true})} placeholder="password"/>
        <input type="submit"/>
      </form>
    </>
  )
}

export default LoginPage;
