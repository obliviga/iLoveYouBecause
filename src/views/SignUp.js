import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Recaptcha from 'react-recaptcha';

import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import { ArrowLeft } from 'mdi-material-ui';

import * as routes from '../constants/routes';
import { db, auth } from '../firebase/firebase';
import byPropKey from '../utils/byPropKey';
import Input from '../components/Input/Input';
import Button from '../components/Button/Button';
import SnackBar from '../components/SnackBar/SnackBar';
import './SignUp.css';

const INITIAL_STATE = {
  firstName: '',
  lastName: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
  recaptchaVerified: false,
  recaptchaApiKey: `${process.env.REACT_APP_RECAPTCHA_API_KEY}`,
  open: false,
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
    this.handleOnVerifyRecaptcha = this.handleOnVerifyRecaptcha.bind(this);
    this.handleOnClickBack = this.handleOnClickBack.bind(this);

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

        auth.currentUser.sendEmailVerification()
          .then(() => {

          }).catch((error) => {

          });

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
        this.setState({
          open: true,
          error,
        });
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

  handleOnVerifyRecaptcha() {
    this.setState({ recaptchaVerified: true });
  }

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({
      open: false,
      success: false,
    });
  };

  handleOnClickBack() {
    this.setState({
      forgetPassword: false,
    });
  }

  render() {
    const {
      firstName,
      lastName,
      email,
      passwordOne,
      passwordTwo,
      error,
      recaptchaVerified,
      open,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      firstName === '' ||
      lastName === '' ||
      recaptchaVerified === false;

    return (
      <div className="signUpContainer">
        <h1>Create an account</h1>
        <Paper className="paper">
          <IconButton
            aria-label="Go Back"
            onClick={this.handleOnClickBack}
            className="backButton"
          >
            <ArrowLeft />
          </IconButton>
          <form onSubmit={this.handleOnSubmit}>
            <div className="inputContainer">
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
            </div>
            <Recaptcha
              sitekey={`${process.env.REACT_APP_RECAPTCHA_API_KEY}`}
              verifyCallback={this.handleOnVerifyRecaptcha}
              className="recaptcha"
            />
            <div className="buttonContainer">
              <Button
                type="submit"
                disabled={isInvalid}
                text="Sign Up"
                size="large"
                fullWidth
              />
            </div>
          </form>
        </Paper>
        <SnackBar
          open={open}
          onClose={this.handleClose}
          variant="error"
          messageText={error && error.message}
        />
      </div>
    );
  }
}

export default withRouter(SignUp);
