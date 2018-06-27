import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import * as routes from '../constants/routes';
import { db, auth } from '../firebase/firebase';
import byPropKey from '../utils/byPropKey';
import Input from '../components/Input/Input';
import Button from '../components/Button/Button';

const INITIAL_STATE = {
  firstName: '',
  lastName: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

class SignUp extends Component {
  constructor(props) {
    super(props);

    this.handleOnSubmit = this.handleOnSubmit.bind(this);
    this.handleOnChangeFirstName = this.handleOnChangeFirstName.bind(this);
    this.handleOnChangeLastName = this.handleOnChangeLastName.bind(this);
    this.handleOnChangeEmail = this.handleOnChangeEmail.bind(this);
    this.handleOnChangePasswordOne = this.handleOnChangePasswordOne.bind(this);
    this.handleOnChangePasswordTwo = this.handleOnChangePasswordTwo.bind(this);
    this.state = { ...INITIAL_STATE };
  }

  handleOnSubmit(event) {
    const {
      email,
      passwordOne,
      firstName,
      lastName,
    } = this.state;

    const {
      history,
    } = this.props;

    auth.createUserWithEmailAndPassword(email, passwordOne)
      .then((user) => {
        this.setState(() => ({ ...INITIAL_STATE }));

        // Redirect to dashboard
        history.push(routes.DASHBOARD);

        // Add user info in database on successful sign up
        const newUser = db
          .collection('users')
          .doc(email);

        newUser.set({
          firstName,
          lastName,
          email,
        });

        // TODO: Updates the displayName to be first name (Not working)
        user.updateProfile({
          displayName: firstName,
        });
      })
      .catch(error => {
        this.setState(byPropKey('error', error));
      });

    event.preventDefault();
  }

  handleOnChangeFirstName(event) {
    this.setState(byPropKey('firstName', event.target.value));
  }

  handleOnChangeLastName(event) {
    this.setState(byPropKey('lastName', event.target.value));
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
      firstName,
      lastName,
      email,
      passwordOne,
      passwordTwo,
      error,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      firstName === '' ||
      lastName === '';

    return (
      <form onSubmit={this.handleOnSubmit}>
        <Input
          value={firstName}
          onChange={this.handleOnChangeFirstName}
          type="text"
          placeholder="First Name"
        />
        <Input
          value={lastName}
          onChange={this.handleOnChangeLastName}
          type="text"
          placeholder="Last Name"
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
