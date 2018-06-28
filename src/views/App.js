import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';

import SignUp from './SignUp';
import LogIn from './LogIn';
import PasswordForget from './PasswordForget';
import Dashboard from './Dashboard';
import Account from './Account';
import Navigation from './Navigation';
import LovedOneProfile from './LovedOneProfile';
import ArchivedReasons from './ArchivedReasons';
import * as routes from '../constants/routes';
import withAuthentication from '../utils/withAuthentication';

const App = () => (
  <Router>
    <React.Fragment>
      <CssBaseline />
      <Navigation />
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
        component={() => <PasswordForget />}
      />
      <Route
        exact
        path={routes.DASHBOARD}
        component={() => <Dashboard />}
      />
      <Route
        exact
        path={routes.ACCOUNT}
        component={() => <Account />}
      />
      <Route
        exact
        path={routes.LOVEDONEPROFILE}
        component={() => <LovedOneProfile />}
      />
      <Route
        exact
        path={routes.ARCHIVEDREASONS}
        component={(location) => <ArchivedReasons location={location} />}
      />
    </React.Fragment>
  </Router>
);

export default withAuthentication(App);
