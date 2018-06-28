import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AWS from 'aws-sdk';

import { db, auth } from '../firebase/firebase';
import Button from '../components/Button/Button';
import Input from '../components/Input/Input';

class Reason extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: '',
      disableSave: true,
      reason: '',
    };

    this.removeReason = this.removeReason.bind(this);
    this.editReason = this.editReason.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
    this.saveEdit = this.saveEdit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.sendReason = this.sendReason.bind(this);
    this.archiveReason = this.archiveReason.bind(this);
  }

  removeReason() {
    const { reason } = this.props;

    db
      .collection('reasons')
      .doc(reason.id)
      .delete();
  }

  handleChange(event) {
    this.setState({ inputValue: event.target.value, disableSave: false });

    if (
      this.props.reason.name === event.target.value ||
      event.target.value === ''
    ) {
      this.setState({ disableSave: true });
    }
  }

  editReason() {
    this.setState({ editMode: true, inputValue: this.props.reason.name });
  }

  cancelEdit() {
    this.setState({ editMode: false });
  }

  saveEdit() {
    const { reason } = this.props;

    this.setState({ editMode: false });

    db
      .collection('reasons')
      .doc(reason.id)
      .update({
        name: this.state.inputValue,
      });
  }

  archiveReason() {
    const { reason, location } = this.props;

    // Create a collection of archived reasons if one doesn't already exist
    auth.onAuthStateChanged(user => {
      const newReasonArchive = db
        .collection('archive')
        .doc();

      // An archived reason should have the following fields
      newReasonArchive.set({
        name: reason.name,
        archivedAt: Date.now(),
        createdFor: location.state.lovedOne.id,
        createdBy: user.email,
        id: newReasonArchive.id,
      });
    });

    this.removeReason();
  }

  sendReason() {
    const { reason, location } = this.props;
    const lovedOneEmail = location.state.lovedOne.email;

    AWS.config.update({
      accessKeyId: `${process.env.REACT_APP_SES_API_KEY_PUBLIC}`,
      secretAccessKey: `${process.env.REACT_APP_SES_API_KEY_PRIVATE}`,
      region: 'us-west-2',
    });

    const params = {
      Destination: {
        ToAddresses: [lovedOneEmail],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: reason.name,
          },
          Text: {
            Charset: 'UTF-8',
            Data: reason.name,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: `${location.state.firstName} loves you, here why:`,
        },
      },
      Source: 'obliviga@gmail.com',
      ReplyToAddresses: [
        'obliviga@gmail.com',
      ],
    };

    // Create the promise and SES service object
    const sendPromise = new AWS.SES({
      apiVersion: '2010-12-01',
    }).sendEmail(params).promise();

    // Handle promise's fulfilled/rejected states
    sendPromise.then(
      (data) => {
        console.log(data.MessageId);
      }).catch(
      (err) => {
        console.error(err, err.stack);
      });

    this.archiveReason();
  }

  render() {
    const { reason } = this.props;

    let removeButton;
    let editButton;
    let saveButton;
    let sendButton;
    let reasonName;

    if (this.state.editMode === true) {
      removeButton = (
        <Button
          onClick={this.removeReason}
          text="Remove"
        />
      );

      editButton = (
        <Button
          onClick={this.cancelEdit}
          text="Cancel"
        />
      );

      saveButton = (
        <Button
          onClick={this.saveEdit}
          text="Save"
          disabled={this.state.disableSave}
        />
      );

      reasonName = (
        <Input
          value={this.state.inputValue}
          placeholder="Han Solo"
          onChange={this.handleChange}
        />
      );
    } else {
      editButton = (
        <Button
          onClick={this.editReason}
          text="Edit"
        />
      );

      sendButton = (
        <Button
          onClick={this.sendReason}
          text="Send"
        />
      );

      reasonName = reason.name;
    }

    return (
      <li>
        {reasonName}
        {removeButton}
        {editButton}
        {saveButton}
        {sendButton}
      </li>
    );
  }
}

Reason.propTypes = {
  reason: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  location: PropTypes.shape({
    hash: PropTypes.string,
    key: PropTypes.string,
    pathname: PropTypes.string,
  }).isRequired,
};

export default Reason;
