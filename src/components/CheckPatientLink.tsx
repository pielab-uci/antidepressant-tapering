import * as React from 'react';
import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../redux/reducers';
import { UserState } from '../redux/reducers/user';

interface Props {
  to: string;
  title: string;
}
const CheckPatientLink: FC<Props> = ({ to, title }) => {
  const { currentPatient } = useSelector<RootState, UserState>((state) => state.user);
  const [returnedLink, setReturnedLink] = useState<any>(null);

  useEffect(() => {
    if (currentPatient) {
      setReturnedLink(<Link to={to}>{title}</Link>);
    } else {
      setReturnedLink(null);
    }
  }, [currentPatient]);
  return <>{returnedLink}</>;
};

export default CheckPatientLink;
