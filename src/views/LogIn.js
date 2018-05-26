import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

import byPropKey from '../utils/byPropKey';
import { auth } from '../firebase';
import * as routes from '../constants/routes';
import Input from '../components/Input/Input';
import Button from '../components/Button/Button';

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class LogIn extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const {
      email,
      password,
    } = this.state;

    const {
      history,
    } = this.props;

    auth.doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState(() => ({ ...INITIAL_STATE }));
        history.push(routes.DASHBOARD);
      })
      .catch(error => {
        this.setState(byPropKey('error', error));
      });

    event.preventDefault();
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
        <form onSubmit={this.onSubmit}>
          <Input
            value={email}
            onChange={
              event => this.setState(byPropKey('email', event.target.value))
            }
            type="text"
            placeholder="Email Address"
          />

          <Input
            value={password}
            onChange={
              event => this.setState(byPropKey('password', event.target.value))
            }
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
