import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import SignUp from './SignUp/SignUp';
import LogIn from './LogIn/LogIn';
import PasswordForgetPage from './PasswordForget';
import Dashboard from './Dashboard';
import AccountPage from './Account';
import * as routes from '../constants/routes';
import withAuthentication from '../utils/withAuthentication';

const App = () => (
  <Router>
    <div>
      <Route
        exact
        path={routes.SIGN_UP}
        component={() => <SignUp />}
      />
      <Route
        exact
        path={routes.LOG_IN}
        component={() => <LogIn />}
      />
      <Route
        exact
        path={routes.PASSWORD_FORGET}
        component={() => <PasswordForgetPage />}
      />
      <Route
        exact
        path={routes.DASHBOARD}
        component={() => <Dashboard />}
      />
      <Route
        exact
        path={routes.ACCOUNT}
        component={() => <AccountPage />}
      />
    </div>
  </Router>
);

export default withAuthentication(App);
