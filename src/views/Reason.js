import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { db } from '../firebase/firebase';
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

  render() {
    const { reason, sent } = this.props;

    let removeButton;
    let editButton;
    let saveButton;
    let reasonName;
    let sentText;

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

    if (sent === true) {
      sentText = <span>(Sent)</span>;
    }

    return (
      <li>
        {reasonName}
        {sentText}
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
  sent: PropTypes.bool,
};

Reason.defaultProps = {
  sent: false,
};

export default Reason;
