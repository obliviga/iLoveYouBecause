import React, { Component } from 'react';
import PropTypes from 'prop-types';

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
    this.archiveReason = this.archiveReason.bind(this);
  }

  removeReason() {
    const { reason, location } = this.props;

    db
      .collection('reasons')
      .doc(reason.id)
      .delete();

    auth.onAuthStateChanged(user => {
      db
        .collection('reasons')
        .where('createdBy', '==', user.email)
        .where('createdFor', '==', location.state.lovedOne.id)
        .onSnapshot(
          call => {
            const reasons = call.docs.map(doc => doc.data());

            if (reasons.length === 0) {
              db
                .collection('users')
                .doc(user.email)
                .collection('lovedOnes')
                .doc(location.state.lovedOne.id)
                .update({
                  sending: false,
                });
            }
          },
        );
    });
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

    const newArchivedReason =
      db
        .collection('archive')
        .doc();

    auth.onAuthStateChanged(user => {
      // An archived reason should have the following fields
      newArchivedReason.set({
        name: reason.name,
        archivedAt: Date.now(),
        createdFor: location.state.lovedOne.id,
        createdBy: user.email,
        id: newArchivedReason.id,
      });
    });
  }

  render() {
    const { reason, location } = this.props;

    let removeButton;
    let editButton;
    let saveButton;
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

      reasonName = reason.name;
    }

    if (reason.sent === true) {
      this.archiveReason();
      this.removeReason();

      db
        .collection('reasons')
        .doc(reason.id)
        .delete();
    }

    return (
      <li>
        {reasonName}
        {removeButton}
        {editButton}
        {saveButton}
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
