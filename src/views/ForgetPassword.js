import React, { Component } from 'react';

import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { EmoticonSad, ArrowLeft, EmoticonHappy } from 'mdi-material-ui';

import { auth } from '../firebase';
import byPropKey from '../utils/byPropKey';
import Input from '../components/Input/Input';
import Button from '../components/Button/Button';
import LogIn from './LogIn';
import './ForgetPassword.css';

const INITIAL_STATE = {
  email: '',
  error: null,
  open: false,
  forgetPassword: true,
  success: false,
};

class ForgetPassword extends Component {
  constructor(props) {
    super(props);

    this.handleOnSubmit = this.handleOnSubmit.bind(this);
    this.handleOnChangeEmail = this.handleOnChangeEmail.bind(this);
    this.handleOnClickBack = this.handleOnClickBack.bind(this);

    this.state = { ...INITIAL_STATE };
  }

  handleOnSubmit(event) {
    const { email } = this.state;

    auth.doPasswordReset(email)
      .then(() => {
        this.setState(() => ({
          email: '',
          forgetPassword: false,
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

  handleClick = () => {
    this.setState({ open: true });
  };

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ open: false });
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
        <Snackbar
          className="snackBar success"
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          open={this.state.success}
          autoHideDuration={6000}
          onClose={this.handleClose}
          message={
            <span className="messageContainer">
              <EmoticonHappy />
              <p className="message">
                Please check your email for the password reset link.
              </p>
              <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                onClick={this.handleClose}
              >
                <CloseIcon />
              </IconButton>
            </span>
          }
        />
        <Snackbar
          className="snackbar error"
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          open={this.state.open}
          autoHideDuration={6000}
          onClose={this.handleClose}
          message={
            <span className="messageContainer">
              <EmoticonSad />
              <p className="message">{error && error.message}</p>
              <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                onClick={this.handleClose}
              >
                <CloseIcon />
              </IconButton>
            </span>
          }
        />
      </div>
    );
  }
}

export default ForgetPassword;
