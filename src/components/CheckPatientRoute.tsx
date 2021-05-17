import * as React from 'react';
import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import { UserState } from '../redux/reducers/user';
import { RootState } from '../redux/reducers';

interface Props {
  path: string;
  component: FC;
}
const CheckPatientRoute: FC<Props> = ({ path, component }) => {
  const { currentPatient } = useSelector<RootState, UserState>((state) => state.user);
  const [returnedRoute, setReturnedRoute] = useState<any>(null);

  useEffect(() => {
    setReturnedRoute(currentPatient ? <Route path={path} component={component}/> : <Redirect to={'/'}/>);
  }, [currentPatient]);
  return <>{returnedRoute}</>;
};

export default CheckPatientRoute;
