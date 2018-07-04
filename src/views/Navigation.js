import React from 'react';
import { Link } from 'react-router-dom';

import * as routes from '../constants/routes';
import AuthUserContext from '../components/AuthUserContext';
import Button from '../components/Button/Button';
import { auth } from '../firebase';

const NavigationAuth = () => (
  <ul>
    <li><Link to={routes.DASHBOARD}>Dashboard</Link></li>
    <li><Link to={routes.ACCOUNT}>Account</Link></li>
    <li>
      <Button onClick={auth.doSignOut} text="Sign Out" />
    </li>
  </ul>
);

const Navigation = () => (
  <AuthUserContext.Consumer>
    {authUser => (authUser ? <NavigationAuth /> : null)}
  </AuthUserContext.Consumer>
);

export default Navigation;
