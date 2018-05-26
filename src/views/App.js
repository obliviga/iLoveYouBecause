import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Navigation from './Navigation';
import LandingPage from './Landing';
import SignUp from './SignUp/SignUp';
import SignIn from './SignIn/SignIn';
import PasswordForgetPage from './PasswordForget';
import HomePage from './Home';
import AccountPage from './Account';
import * as routes from '../constants/routes';
import withAuthentication from '../utils/withAuthentication';

const App = () => (
  <Router>
    <div>
      <Navigation />
      <hr />
      <Route
        exact
        path={routes.LANDING}
        component={() => <LandingPage />}
      />
      <Route
        exact
        path={routes.SIGN_UP}
        component={() => <SignUp />}
      />
      <Route
        exact
        path={routes.SIGN_IN}
        component={() => <SignIn />}
      />
      <Route
        exact
        path={routes.PASSWORD_FORGET}
        component={() => <PasswordForgetPage />}
      />
      <Route
        exact
        path={routes.HOME}
        component={() => <HomePage />}
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
