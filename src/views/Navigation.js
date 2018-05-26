import React from 'react';
import { Link } from 'react-router-dom';

import * as routes from '../constants/routes';
import SignOutButton from '../components/SignOutButton';
import AuthUserContext from '../components/AuthUserContext';

const NavigationAuth = () => (
  <ul>
    <li><Link to={routes.DASHBOARD}>Dashboard</Link></li>
    <li><Link to={routes.ACCOUNT}>Account</Link></li>
    <li><SignOutButton /></li>
  </ul>
);

const NavigationNonAuth = () => (
  <ul>
    <li><Link to={routes.SIGN_IN}>Sign In</Link></li>
  </ul>
);

const Navigation = () => (
  <AuthUserContext.Consumer>
    {authUser => (authUser ? <NavigationAuth /> : <NavigationNonAuth />)}
  </AuthUserContext.Consumer>
);

export default Navigation;
