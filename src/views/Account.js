import React from 'react';

import AuthUserContext from '../components/AuthUserContext';
import PasswordForget from './PasswordForget';
import PasswordChange from './PasswordChange';
import withAuthorization from '../utils/withAuthorization';

const AccountPage = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <div>
        <h1>Account: {authUser.email}</h1>
        <PasswordForget />
        <PasswordChange />
      </div>
    )}
  </AuthUserContext.Consumer>
);

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(AccountPage);
