import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import * as routes from '../constants/routes';
import { auth, db } from '../firebase';
import byPropKey from '../utils/byPropKey';
import Input from '../components/Input/Input';
import Button from '../components/Button/Button';

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

class SignUp extends Component {
  constructor(props) {
    super(props);

    this.handleOnSubmit = this.handleOnSubmit.bind(this);
    this.handleOnChangeUsername = this.handleOnChangeUsername.bind(this);
    this.handleOnChangeEmail = this.handleOnChangeEmail.bind(this);
    this.handleOnChangePasswordOne = this.handleOnChangePasswordOne.bind(this);
    this.handleOnChangePasswordTwo = this.handleOnChangePasswordTwo.bind(this);
    this.state = { ...INITIAL_STATE };
  }

  handleOnSubmit(event) {
    const {
      username,
      email,
      passwordOne,
    } = this.state;

    const {
      history,
    } = this.props;

    auth.doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        db.doCreateUser(authUser.uid, username, email)
          .then(() => {
            this.setState(() => ({ ...INITIAL_STATE }));
            history.push(routes.DASHBOARD);
          })
          .catch(error => {
            this.setState(byPropKey('error', error));
          });
      })
      .catch(error => {
        this.setState(byPropKey('error', error));
      });

    event.preventDefault();
  }

  handleOnChangeUsername(event) {
    this.setState(byPropKey('username', event.target.value));
  }

  handleOnChangeEmail(event) {
    this.setState(byPropKey('email', event.target.value));
  }

  handleOnChangePasswordOne(event) {
    this.setState(byPropKey('passwordOne', event.target.value));
  }

  handleOnChangePasswordTwo(event) {
    this.setState(byPropKey('passwordTwo', event.target.value));
  }

  render() {
    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      error,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === '';

    return (
      <form onSubmit={this.handleOnSubmit}>
        <Input
          value={username}
          onChange={this.handleOnChangeUsername}
          type="text"
          placeholder="Full Name"
        />
        <Input
          value={email}
          onChange={this.handleOnChangeEmail}
          type="email"
          placeholder="Email Address"
        />
        <Input
          value={passwordOne}
          onChange={this.handleOnChangePasswordOne}
          type="password"
          placeholder="Password"
        />
        <Input
          value={passwordTwo}
          onChange={this.handleOnChangePasswordTwo}
          type="password"
          placeholder="Confirm Password"
        />
        <Button
          disabled={isInvalid}
          type="submit"
          text="Sign Up"
        />

        { error && <p>{error.message}</p> }
      </form>
    );
  }
}

export default withRouter(SignUp);
