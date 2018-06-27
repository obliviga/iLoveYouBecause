import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import byPropKey from '../utils/byPropKey';
import { auth } from '../firebase';
import * as routes from '../constants/routes';
import Input from '../components/Input/Input';
import Button from '../components/Button/Button';

class LogIn extends Component {
  constructor(props) {
    super(props);

    this.handleOnSubmit = this.handleOnSubmit.bind(this);
    this.handleOnChangeEmail = this.handleOnChangeEmail.bind(this);
    this.handleOnChangePassword = this.handleOnChangePassword.bind(this);

    this.state = {
      email: '',
      password: '',
      error: null,
    };
  }

  handleOnSubmit(event) {
    const {
      email,
      password,
    } = this.state;

    const {
      history,
    } = this.props;

    auth.doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState(() => ({
          email: '',
          password: '',
          error: null,
        }));
        history.push(routes.DASHBOARD);
      })
      .catch(error => {
        this.setState(byPropKey('error', error));
      });

    event.preventDefault();
  }

  handleOnChangeEmail(event) {
    this.setState(byPropKey('email', event.target.value));
  }

  handleOnChangePassword(event) {
    this.setState(byPropKey('password', event.target.value));
  }

  render() {
    const {
      email,
      password,
      error,
    } = this.state;

    const isInvalid = password === '' || email === '';

    return (
      <div>
        <h1>Log In</h1>
        <form onSubmit={this.handleOnSubmit}>
          <Input
            value={email}
            onChange={this.handleOnChangeEmail}
            type="email"
            placeholder="Email Address"
          />

          <Input
            value={password}
            onChange={this.handleOnChangePassword}
            type="password"
            placeholder="Password"
          />

          <Button
            type="submit"
            disabled={isInvalid}
            text="Log In"
          />

          { error && <p>{error.message}</p> }
        </form>
        <Link to="/pw-forget">Forgot Password?</Link>
        <p>Don&apos;t have an account?</p>
        <Link to={routes.SIGN_UP}>Sign Up</Link>
      </div>
    );
  }
}

export default withRouter(LogIn);

LogIn.propTypes = {
  history: PropTypes.shape({}),
};

LogIn.defaultProps = {
  history: {},
};
