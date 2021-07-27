import { Link, Redirect, RouteComponentProps } from 'react-router-dom';
import * as React from 'react';
import { FC } from 'react';
import { UserState } from '../redux/reducers/user';

export const checkCurrentPatientAndRender = (currentPatient: UserState['currentPatient'], Component: FC) => (props: RouteComponentProps) => {
  return currentPatient ? <Component /> : <Redirect to={'/'}/>;
};

export const checkAndRenderLink = (currentPatient: UserState['currentPatient'], link: string, title: string) => {
  return currentPatient ? <Link to={link}>{title}</Link> : null;
};
