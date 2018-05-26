import React from 'react';
import { withRouter } from 'react-router-dom';

import { SignUpForm } from './SignUpForm';

const SignUp = ({ history }) => (
  <div>
    <h1>SignUp</h1>
    <SignUpForm history={history} />
  </div>
);

export default withRouter(SignUp);
