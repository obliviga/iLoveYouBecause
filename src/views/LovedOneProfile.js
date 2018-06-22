import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import AWS from 'aws-sdk';

import { db, auth } from '../firebase/firebase';
import withAuthorization from '../utils/withAuthorization';
import Button from '../components/Button/Button';
import Input from '../components/Input/Input';
import Reason from './Reason';

class LovedOneProfile extends Component {
  constructor(props) {
    super(props);

    const { location } = this.props;

    // Getting loved one's data
    auth.onAuthStateChanged(user => {
      const lovedOneRef = db
        .collection('users')
        .doc(user.email)
        .collection('lovedOnes')
        .doc(location.state.lovedOne.id);

      lovedOneRef.get().then((doc) => {
        this.setState({
          frequency: doc.data().frequency,
          sending: doc.data().sending,
        });
      });
    });

    this.handleChangeReason = this.handleChangeReason.bind(this);
    this.handleChangeLovedOneName = this.handleChangeLovedOneName.bind(this);
    this.handleChangeLovedOneEmail = this.handleChangeLovedOneEmail.bind(this);
    this.handleKeyPressReason = this.handleKeyPressReason.bind(this);
    this.addReason = this.addReason.bind(this);
    this.editLovedOne = this.editLovedOne.bind(this);
    this.cancelEditLovedOne = this.cancelEditLovedOne.bind(this);
    this.saveLovedOne = this.saveLovedOne.bind(this);
    this.startSendingReasons = this.startSendingReasons.bind(this);
    this.stopSendingReasons = this.stopSendingReasons.bind(this);
    this.handleChangeFrequency = this.handleChangeFrequency.bind(this);
    this.sendReason = this.sendReason.bind(this);
    this.getFirstReason = this.getFirstReason.bind(this);


    this.state = {
      reasons: [],
      inputValueReason: '',
      inputValueLovedOneName: location.state.lovedOne.name,
      inputValueLovedOneEmail: location.state.lovedOne.email,
      editMode: false,
      frequency: '60000',
      sending: location.state.lovedOne.sending,
      firstReasonId: null,
    };
  }

  componentDidMount() {
    const { location } = this.props;

    // Getting reasons that were created by the current user and
    // created for the currently viewed loved one
    auth.onAuthStateChanged(user => {
      db
        .collection('reasons')
        .where('createdBy', '==', user.email)
        .where('createdFor', '==', location.state.lovedOne.id)
        .orderBy('createdAt', 'desc')
        .onSnapshot(
          call => {
            const reasons = call.docs.map(doc => doc.data());
            this.setState({ reasons });
          },
        );
    });
  }

  getFirstReason() {
    const { location } = this.props;

    if (this.state.reasons.length > 0) {
      auth.onAuthStateChanged(user => {
        db
          .collection('reasons')
          .where('createdBy', '==', user.email)
          .where('createdFor', '==', location.state.lovedOne.id)
          .where('sent', '==', false)
          .orderBy('createdAt', 'desc')
          .limit(1)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              this.setState({ firstReasonId: doc.id });
            });
          })
          .catch((error) => {
            console.log("Error getting documents: ", error);
          });

        if (this.state.firstReasonId !== null) {
          db
            .collection('reasons')
            .doc(this.state.firstReasonId)
            .update({
              sent: true,
            });
        }
      });
    } else {
      this.stopSendingReasons();
      alert('Please add a reason to continue.');
    }
  }

  addReason() {
    const { location } = this.props;

    // Create a collection of reasons if one doesn't already exist
    auth.onAuthStateChanged(user => {
      const newReason = db
        .collection('reasons')
        .doc();

      // A reason should have the following fields
      newReason.set({
        name: this.state.inputValueReason,
        createdAt: Date.now(),
        createdFor: location.state.lovedOne.id,
        createdBy: user.email,
        id: newReason.id,
        sent: false,
      });

      this.setState({
        inputValueReason: '',
      });

      // Need to reset sending to false, just in case a reason was added
      // and sending stayed true
      if (this.state.reasons.length === 0) {
        this.setState({ sending: false });
      }
    });
  }

  handleChangeReason(event) {
    this.setState({ inputValueReason: event.target.value });
  }

  handleKeyPressReason(event) {
    if (event.key === 'Enter' && this.state.inputValueReason !== '') {
      this.addReason();
    }
  }

  handleChangeLovedOneName(event) {
    this.setState({ inputValueLovedOneName: event.target.value });
  }

  handleChangeLovedOneEmail(event) {
    this.setState({ inputValueLovedOneEmail: event.target.value });
  }

  editLovedOne() {
    this.setState({
      editMode: true,
      inputValueLovedOneName: this.state.inputValueLovedOneName,
      inputValueLovedOneEmail: this.state.inputValueLovedOneEmail,
    });
  }

  cancelEditLovedOne() {
    const { location } = this.props;

    this.setState({
      editMode: false,
      inputValueLovedOneName: location.state.lovedOne.name,
      inputValueLovedOneEmail: location.state.lovedOne.email,
    });
  }

  saveLovedOne() {
    const { location } = this.props;

    // Updating name and email of loved one in the database
    auth.onAuthStateChanged(user => {
      db
        .collection('users')
        .doc(user.email)
        .collection('lovedOnes')
        .doc(location.state.lovedOne.id)
        .update({
          name: this.state.inputValueLovedOneName,
          email: this.state.inputValueLovedOneEmail,
        });
    });

    this.setState({ editMode: false });
  }

  // TODO: Figure it out.
  // Take the first reason and make it a sent one, then send it.
  sendReason() {
    this.getFirstReason();
  }

  // TODO: Figure it out.
  startSendingReasons() {
    const { location } = this.props;
    this.setState({ sending: true });

    auth.onAuthStateChanged(user => {
      db
        .collection('users')
        .doc(user.email)
        .collection('lovedOnes')
        .doc(location.state.lovedOne.id)
        .update({
          sending: true,
        });
    });

    this.timerId = setInterval(
      () => this.sendReason(),
      this.state.frequency,
    );
  }

  // Updating the sending state and field to be false
  stopSendingReasons() {
    const { location } = this.props;
    this.setState({ sending: false });

    auth.onAuthStateChanged(user => {
      db
        .collection('users')
        .doc(user.email)
        .collection('lovedOnes')
        .doc(location.state.lovedOne.id)
        .update({
          sending: false,
        });
    });

    clearInterval(this.timerId);
  }

  handleChangeFrequency(event) {
    const { location } = this.props;

    auth.onAuthStateChanged(user => {
      db
        .collection('users')
        .doc(user.email)
        .collection('lovedOnes')
        .doc(location.state.lovedOne.id)
        .update({
          frequency: this.state.frequency,
        });
    });

    this.setState({ frequency: event.target.value });
  }

  render() {
    const { location } = this.props;

    let reasons;
    let sentReasons;
    let inputValid;
    let reasonBlurb;
    let editLovedOneButton;
    let saveLovedOneButton;
    let lovedOneName = this.state.inputValueLovedOneName;
    let lovedOneEmail = this.state.inputValueLovedOneEmail;
    let disableFrequencyAndSend;
    let startSendingButton;
    let stopSendingButton;

    if (this.state.reasons.length > 0) {
      reasons = (
        this.state.reasons.map((reason) => (
          <Reason
            key={reason.id}
            reason={reason}
            sent={location.state.lovedOne.sent}
            location={location}
          />
        ))
      );

      startSendingButton = (
        <Button
          onClick={this.startSendingReasons}
          text="Start Sending"
        />
      );

      stopSendingButton = (
        <Button
          onClick={this.stopSendingReasons}
          text="Stop Sending"
        />
      );

      reasonBlurb = `Here are the reasons why you love ${lovedOneName}:`;
    } else {
      reasonBlurb = `Add some reasons why you love ${lovedOneName}`;
    }

    // Validation for inputting reason
    if (this.state.inputValueReason === '') {
      inputValid = false;
    } else {
      inputValid = true;
    }

    // Show some buttons when edit mode is true,
    // and only show edit button when edit mode is false.
    if (this.state.editMode === true) {
      editLovedOneButton = (
        <Button
          onClick={this.cancelEditLovedOne}
          text="Cancel"
        />
      );

      saveLovedOneButton = (
        <Button
          onClick={this.saveLovedOne}
          text="Save"
        />
      );

      lovedOneName = (
        <Input
          value={this.state.inputValueLovedOneName}
          placeholder="Jyn Erso"
          onChange={this.handleChangeLovedOneName}
          onKeyPress={this.handleKeyPressLovedOneName}
        />
      );

      lovedOneEmail = (
        <Input
          value={this.state.inputValueLovedOneEmail}
          placeholder="jyn.erso@rogueone.com"
          onChange={this.handleChangeLovedOneEmail}
          onKeyPress={this.handleKeyPressLovedOneEmail}
        />
      );
    } else {
      editLovedOneButton = (
        <Button
          onClick={this.editLovedOne}
          text="Edit"
        />
      );
    }

    if (this.state.sending) {
      startSendingButton = null;
    } else {
      stopSendingButton = null;
    }

    return (
      <div>
        {editLovedOneButton}
        {saveLovedOneButton}
        <p>Name: {lovedOneName}</p>
        <p>Email: {lovedOneEmail}</p>
        <h2>{reasonBlurb}</h2>
        <Input
          value={this.state.inputValueReason}
          placeholder="Because your hair is awesome"
          onChange={this.handleChangeReason}
          onKeyPress={this.handleKeyPressReason}
        />
        <Button
          onClick={this.addReason}
          text="Add"
          disabled={!inputValid}
        />
        <p>Send a reason every:</p>
        <select
          name="frequency"
          value={this.state.frequency}
          onChange={this.handleChangeFrequency}
          disabled={disableFrequencyAndSend}
        >
          <option value="1000">Second</option>
          <option value="60000">Minute</option>
          <option value="3600000">Hour</option>
        </select>
        <ul>{reasons}</ul>
        <ul>{sentReasons}</ul>
        {startSendingButton}
        {stopSendingButton}
      </div>
    );
  }
}

LovedOneProfile.propTypes = {
  location: PropTypes.shape({
    hash: PropTypes.string,
    key: PropTypes.string,
    pathname: PropTypes.string,
  }),
};

LovedOneProfile.defaultProps = {
  location: {
    hash: '',
    key: '',
    pathname: '',
  },
};

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(withRouter(LovedOneProfile));
