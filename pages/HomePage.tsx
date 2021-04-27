import * as React from 'react';
import {useSelector} from "react-redux";
import {UserState} from "../redux/reducers/user";
import {RootState} from "../redux/reducers";
import LoginPage from "./LoginPage";

const HomePage = () => {
  // const {me} = useSelector<RootState, UserState>(state => state.user)

  return (
    <>
      <div>Home</div>
    </>
  )
}

export default HomePage;
