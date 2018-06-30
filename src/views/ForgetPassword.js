import React, { Component } from 'react';

import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import { ArrowLeft } from 'mdi-material-ui';

import { auth } from '../firebase';
import byPropKey from '../utils/byPropKey';
import Input from '../components/Input/Input';
import Button from '../components/Button/Button';
import SnackBar from '../components/SnackBar/SnackBar';
import LogIn from './LogIn';
import './ForgetPassword.css';

class ForgetPassword extends Component {
  constructor(props) {
    super(props);

    this.handleOnSubmit = this.handleOnSubmit.bind(this);
    this.handleOnChangeEmail = this.handleOnChangeEmail.bind(this);
    this.handleOnClickBack = this.handleOnClickBack.bind(this);

    this.state = {
      email: '',
      error: '',
      open: false,
      forgetPassword: true,
      success: false,
    };
  }

  handleOnSubmit(event) {
    const { email } = this.state;

    auth.doPasswordReset(email)
      .then(() => {
        this.setState(() => ({
          email: '',
          success: true,
        }));
      })
      .catch(error => {
        this.setState({
          open: true,
          error,
        });
      });

    event.preventDefault();
  }

  handleOnChangeEmail(event) {
    this.setState(byPropKey('email', event.target.value));
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
      email,
      error,
      forgetPassword,
      success,
      open,
    } = this.state;

    const isInvalid = email === '';

    if (forgetPassword === false) {
      return (
        <LogIn />
      );
    }

    return (
      <div className="forgetPasswordContainer">
        <h1>Reset Your Password:</h1>
        <Paper className="paper">
          <IconButton
            aria-label="Go Back"
            onClick={this.handleOnClickBack}
            className="backButton"
          >
            <ArrowLeft />
          </IconButton>
          <form onSubmit={this.handleOnSubmit}>
            <Input
              value={email}
              onChange={this.handleOnChangeEmail}
              type="email"
              placeholder="hermit.yoda@dagobah.com"
              label="Email Address"
            />
            <div className="buttonContainer">
              <Button
                type="submit"
                disabled={isInvalid}
                text="Do it."
                size="large"
                fullWidth
              />
            </div>
          </form>
        </Paper>
        <SnackBar
          open={success}
          onClose={this.handleClose}
          variant="success"
          messageText="Please check your email for the password reset link."
        />
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

export default ForgetPassword;
