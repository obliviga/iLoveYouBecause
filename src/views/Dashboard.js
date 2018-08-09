import React, { Component } from 'react';
import Timer from 'easytimer.js';

import List from '@material-ui/core/List';
import AddIcon from '@material-ui/icons/Add';
import MaterialButton from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Paper from '@material-ui/core/Paper';

import { db, auth } from '../firebase/firebase';
import withAuthorization from '../utils/withAuthorization';
import Button from '../components/Button/Button';
import Input from '../components/Input/Input';
import LoadingIndicator from '../components/LoadingIndicator/LoadingIndicator';
import LovedOne from './LovedOne';

import './Dashboard.css';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lovedOnes: [],
      nameInputValue: '',
      emailInputValue: '',
      firstName: '',
      disableResendConfirmation: true,
      timer: '',
      emailVerified: auth.currentUser.emailVerified,
      dense: false,
      open: false,
    };

    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleKeyPressName = this.handleKeyPressName.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleKeyPressEmail = this.handleKeyPressEmail.bind(this);
    this.addLovedOne = this.addLovedOne.bind(this);
    this.resendConfirmation = this.resendConfirmation.bind(this);
    this.enableResendConfirmation = this.enableResendConfirmation.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.checkUserConfirmed = this.checkUserConfirmed.bind(this);
    this.showAddLovedOneModal = this.showAddLovedOneModal.bind(this);

    auth.onAuthStateChanged(user => {
      const userRef = db
        .collection('users')
        .doc(`${user.email}`);

      // Getting user's first name
      userRef.get().then((doc) => {
        if (doc.exists) {
          const firstName = doc.data().firstName;

          this.setState({ firstName });
        } else {
          console.log('No such document!');
        }
      }).catch((error) => {
        console.log('Error getting document:', error);
      });
    });
  }

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      db
        .collection('users')
        .doc(`${user.email}`)
        .collection('lovedOnes')
        .orderBy('createdAt', 'desc')
        .onSnapshot(
          call => {
            const lovedOnes = call.docs.map(doc => doc.data());
            this.setState({ lovedOnes });
          },
        );

      this.setState({ user });
    });

    if (auth.currentUser.emailVerified === false) {
      this.startTimer();
    }
  }

  handleChangeName(event) {
    this.setState({ nameInputValue: event.target.value });
  }

  handleKeyPressName(event) {
    const keyPressValidation = event.key === 'Enter' &&
      this.state.nameInputValue !== '' &&
      this.state.emailInputValue !== '';

    if (keyPressValidation) {
      this.addLovedOne();
    }
  }

  handleChangeEmail(event) {
    this.setState({ emailInputValue: event.target.value });
  }

  handleKeyPressEmail(event) {
    const keyPressValidation = event.key === 'Enter' &&
      this.state.nameInputValue !== '' &&
      this.state.emailInputValue !== '';

    if (keyPressValidation) {
      this.addLovedOne();
    }
  }

  addLovedOne() {
    auth.onAuthStateChanged(user => {
      const newLovedOne = db
        .collection('users')
        .doc(user.email)
        .collection('lovedOnes')
        .doc();

      newLovedOne.set({
        name: this.state.nameInputValue,
        email: this.state.emailInputValue,
        id: newLovedOne.id,
        createdAt: Date.now(),
        frequency: '60000',
        sending: false,
      });

      this.setState({
        nameInputValue: '',
        emailInputValue: '',
      });

      this.handleClose();
    });
  }

  startTimer() {
    const timer = new Timer();

    timer.start({
      countdown: true,
      startValues: { seconds: 30 },
    });

    timer.addEventListener('secondsUpdated', () => {
      this.setState({ timer: timer.getTimeValues().seconds });
      this.checkUserConfirmed();
    });

    timer.addEventListener('targetAchieved', () => {
      this.setState({ timer: '' });
      this.checkUserConfirmed();

      this.enableResendConfirmation();
    });

    if (this.state.emailVerified === true) {
      timer.removeventListener('secondsUpdated', () => {});
      timer.removeventListener('targetAchieved', () => {});
    }
  }

  resendConfirmation() {
    if (auth.currentUser.emailVerified === true) {
      this.setState({
        emailVerified: true,
      });
    } else {
      auth.currentUser.sendEmailVerification()
        .then(() => {
          this.setState({ disableResendConfirmation: true });

          if (this.state.emailVerified === false) {
            this.startTimer();
          }
        }).catch((error) => {
          // TODO: Snackbar error
        });
    }
  }

  enableResendConfirmation() {
    this.setState({ disableResendConfirmation: false });
  }

  checkUserConfirmed() {
    if (auth.currentUser) {
      switch (auth.currentUser.emailVerified) {
        case true:
          this.setState({
            emailVerified: true,
          });

          break;
        case false:
          auth.currentUser.reload();

          break;
        default: break;
      }
    }
  }

  showAddLovedOneModal() {
    this.setState({
      open: true,
    });
  }

  handleClose = value => {
    this.setState({ selectedValue: value, open: false });
  };

  render() {
    const { dense } = this.state;
    const { onClose, selectedValue, ...other } = this.props;

    let lovedOnes;
    let inputsValid;
    let welcomeBlurb;

    if (this.state.lovedOnes.length > 0) {
      lovedOnes = (
        this.state.lovedOnes.map((lovedOne) => (
          <LovedOne
            key={lovedOne.id}
            lovedOne={lovedOne}
            firstName={this.state.firstName}
          />
        ))
      );

      welcomeBlurb = 'Here are your loved ones:';
    } else {
      welcomeBlurb = 'Feel free to add some loved ones below.';
    }

    if (this.state.nameInputValue === '' || this.state.emailInputValue === '') {
      inputsValid = false;
    } else {
      inputsValid = true;
    }

    // Prevent first name from appearing after other components have loaded
    if (!this.state.firstName) {
      return <LoadingIndicator />;
    }

    // If the current user is not verified
    if (this.state.emailVerified === false) {
      // If resend confirmation button is enabled
      if (this.state.disableResendConfirmation === false) {
        const timer = new Timer();

        timer.start();

        timer.addEventListener('secondsUpdated', () => {
          this.checkUserConfirmed();
        });
      }

      return (
        <div>
          <p>
            Please check your email ({auth.currentUser.email})
            and click the link to verify your account in order to continue.
          </p>
          <Button
            onClick={this.resendConfirmation}
            text={`Resend Confirmation ${this.state.timer}`}
            disabled={this.state.disableResendConfirmation}
          />
        </div>
      );
    }

    return (
      <div className="dashboardContainer">
        <h1>Hey {this.state.firstName}!</h1>
        <h2>{welcomeBlurb}</h2>
        {/* <Typography variant="title">
          Add em&#39;
        </Typography> */}
        <div className="paperContainer">
          <Paper>
            <List dense={dense}>
              {lovedOnes}
            </List>
          </Paper>
        </div>
        <MaterialButton
          variant="fab"
          color="primary"
          aria-label="Add"
          onClick={this.showAddLovedOneModal}
          className="addLovedOne"
        >
          <AddIcon />
        </MaterialButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
          className="dashboardDialog"
          fullWidth
        >
          <DialogTitle id="form-dialog-title">Add a loved one:</DialogTitle>
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={this.handleClose}
            className="closeIcon"
          >
            <CloseIcon />
          </IconButton>
          <DialogContent>
            <div className="formGroup">
              <Input
                value={this.state.nameInputValue}
                placeholder="Jyn Erso"
                onChange={this.handleChangeName}
                onKeyPress={this.handleKeyPressName}
                label="Name"
              />
              <Input
                type="email"
                value={this.state.emailInputValue}
                placeholder="jyn.erso@rogueone.com"
                onChange={this.handleChangeEmail}
                onKeyPress={this.handleKeyPressEmail}
                label="Email"
              />
            </div>
          </DialogContent>
          <DialogActions>
            <div className="dashboardDialogActions">
              <Button
                text="Add"
                onClick={this.addLovedOne}
                disabled={!inputsValid}
              />
            </div>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(Dashboard);
