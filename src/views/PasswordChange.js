import React, { Component } from 'react';

import { auth } from '../firebase';
import byPropKey from '../utils/byPropKey';
import Input from '../components/Input/Input';
import Button from '../components/Button/Button';

const INITIAL_STATE = {
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

class PasswordChange extends Component {
  constructor(props) {
    super(props);

    this.handleOnSubmit = this.handleOnSubmit.bind(this);
    this.handleOnChangePasswordOne = this.handleOnChangePasswordOne.bind(this);
    this.handleOnChangePasswordTwo = this.handleOnChangePasswordTwo.bind(this);
    this.state = { ...INITIAL_STATE };
  }

  handleOnSubmit(event) {
    const { passwordOne } = this.state;

    auth.doPasswordUpdate(passwordOne)
      .then(() => {
        this.setState(() => ({ ...INITIAL_STATE }));
      })
      .catch(error => {
        this.setState(byPropKey('error', error));
      });

    event.preventDefault();
  }

  handleOnChangePasswordOne(event) {
    this.setState(byPropKey('passwordOne', event.target.value));
  }

  handleOnChangePasswordTwo(event) {
    this.setState(byPropKey('passwordTwo', event.target.value));
  }

  render() {
    const {
      passwordOne,
      passwordTwo,
      error,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '';

    return (
      <form onSubmit={this.handleOnSubmit}>
        <Input
          value={passwordOne}
          onChange={this.handleOnChangePasswordOne}
          type="password"
          placeholder="New Password"
        />
        <Input
          value={passwordTwo}
          onChange={this.handleOnChangePasswordTwo}
          type="password"
          placeholder="Confirm New Password"
        />
        <Button
          disabled={isInvalid}
          type="submit"
          text="Reset My Password"
        />
        { error && <p>{error.message}</p> }
      </form>
    );
  }
}

export default PasswordChange;
