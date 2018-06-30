import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { EmoticonSad } from 'mdi-material-ui';

import byPropKey from '../utils/byPropKey';
import { auth } from '../firebase';
import * as routes from '../constants/routes';
import Input from '../components/Input/Input';
import PasswordInput from '../components/Input/PasswordInput';
import Button from '../components/Button/Button';
import ForgetPassword from './ForgetPassword';

import './LogIn.css';

class LogIn extends Component {
  constructor(props) {
    super(props);

    this.handleOnSubmit = this.handleOnSubmit.bind(this);
    this.handleOnChangeEmail = this.handleOnChangeEmail.bind(this);
    this.handleOnChangePassword = this.handleOnChangePassword.bind(this);
    this.handleOnClickForgetPassword =
      this.handleOnClickForgetPassword.bind(this);

    this.state = {
      email: '',
      password: '',
      error: null,
      open: false,
      forgetPassword: false,
      checked: false,
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

  handleOnChangePassword(event) {
    this.setState(byPropKey('password', event.target.value));
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

  handleOnClickForgetPassword() {
    this.setState({
      forgetPassword: !this.state.forgetPassword,
      checked: !this.state.checked,
    });
  }

  render() {
    const {
      email,
      password,
      error,
      checked,
    } = this.state;

    const isInvalid = password === '' || email === '';

    if (this.state.forgetPassword) {
      return (
        <ForgetPassword />
      );
    }

    return (
      <div className="logInContainer">
        <h1>iLoveYouBecause</h1>
        <Paper className="paper">
          <form onSubmit={this.handleOnSubmit}>
            <Input
              value={email}
              onChange={this.handleOnChangeEmail}
              type="email"
              placeholder="darth.vader@sith.com"
              label="Email Address"
            />

            <div className="passwordInput">
              <PasswordInput
                value={password}
                onChange={this.handleOnChangePassword}
              />
            </div>
            <div className="buttonContainer">
              <Button
                type="submit"
                disabled={isInvalid}
                text="Log In"
                size="large"
                fullWidth
              />
            </div>
          </form>
          <div className="formText">
            <a
              href="#forgetPassword"
              onClick={this.handleOnClickForgetPassword}
              className="forgetPasswordText"
            >
              Forget Password?
            </a>
            <div className="signUpContainer">
              <p className="noAccount">Don&apos;t have an account?</p>
              <Link to={routes.SIGN_UP}> Sign Up!</Link>
            </div>
          </div>
        </Paper>
        <Snackbar
          className="snackbar"
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          open={this.state.open}
          autoHideDuration={6000}
          onClose={this.handleClose}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={
            <span id="message-id" className="messageContainer">
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

export default withRouter(LogIn);

LogIn.propTypes = {
  history: PropTypes.shape({}),
};

LogIn.defaultProps = {
  history: {},
};
