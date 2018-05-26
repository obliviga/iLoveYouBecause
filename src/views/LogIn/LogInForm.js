import React, { Component } from 'react';

import { auth } from '../../firebase';
import * as routes from '../../constants/routes';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class LogInForm extends Component {
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

    const isInvalid =
      password === '' ||
      email === '';

    return (
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
          text="Sign In"
        />

        { error && <p>{error.message}</p> }
      </form>
    );
  }
}

export { LogInForm };
