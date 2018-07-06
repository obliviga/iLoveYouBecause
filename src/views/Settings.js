import React from 'react';

import AuthUserContext from '../components/AuthUserContext';
import ForgetPassword from './ForgetPassword';
import PasswordChange from './PasswordChange';
import withAuthorization from '../utils/withAuthorization';

const Settings = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <div>
        <h1>Account: {authUser.email}</h1>
        <ForgetPassword />
        <PasswordChange />
      </div>
    )}
  </AuthUserContext.Consumer>
);

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(Settings);
