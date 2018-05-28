import React, { Component } from 'react';

import { auth } from '../firebase';
import byPropKey from '../utils/byPropKey';
import Input from '../components/Input/Input';
import Button from '../components/Button/Button';

const INITIAL_STATE = {
  email: '',
  error: null,
};

class PasswordForget extends Component {
  constructor(props) {
    super(props);

    this.handleOnSubmit = this.handleOnSubmit.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.state = { ...INITIAL_STATE };
  }

  handleOnSubmit(event) {
    const { email } = this.state;

    auth.doPasswordReset(email)
      .then(() => {
        this.setState(() => ({ ...INITIAL_STATE }));
      })
      .catch(error => {
        this.setState(byPropKey('error', error));
      });

    event.preventDefault();
  }

  handleOnChange(event) {
    this.setState(byPropKey('email', event.target.value));
  }

  render() {
    const {
      email,
      error,
    } = this.state;

    const isInvalid = email === '';

    return (
      <div>
        <h1>PasswordForget</h1>
        <form onSubmit={this.handleOnSubmit}>
          <Input
            value={this.state.email}
            onChange={this.handleOnChange}
            type="email"
            placeholder="Email Address"
          />
          <Button
            disabled={isInvalid}
            type="submit"
            text="Reset My Password"
          />

          { error && <p>{error.message}</p> }
        </form>
      </div>
    );
  }
}

export default PasswordForget;
