import React from 'react';
import { withRouter } from 'react-router-dom';

import { SignUpLink } from '../../components/SignUpLink';
import { PasswordForgetLink } from '../PasswordForget';
import { LogInForm } from './LogInForm';

const LogIn = ({ history }) => (
  <div>
    <h1>Log In</h1>
    <LogInForm history={history} />
    <PasswordForgetLink />
    <SignUpLink />
  </div>
);

export default withRouter(LogIn);
