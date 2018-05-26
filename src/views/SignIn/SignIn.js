import React from 'react';
import { withRouter } from 'react-router-dom';

import { SignUpLink } from '../../components/SignUpLink';
import { PasswordForgetLink } from '../PasswordForget';
import { SignInForm } from './SignInForm';

const SignIn = ({ history }) => (
  <div>
    <h1>SignIn</h1>
    <SignInForm history={history} />
    <PasswordForgetLink />
    <SignUpLink />
  </div>
);

export default withRouter(SignIn);
