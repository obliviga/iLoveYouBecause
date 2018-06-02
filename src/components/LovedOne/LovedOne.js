import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { db, auth } from '../../firebase/firebase';
import Button from '../Button/Button';
import Input from '../Input/Input';

class LovedOne extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      inputValue: '',
    };

    this.removeLovedOne = this.removeLovedOne.bind(this);
    this.editLovedOne = this.editLovedOne.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
    this.saveEdit = this.saveEdit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  removeLovedOne() {
    const { lovedOne } = this.props;

    auth.onAuthStateChanged(user => {
      db
        .collection('users')
        .doc(user.email)
        .collection('lovedOnes')
        .doc(lovedOne.id)
        .delete();
    });
  }

  handleChange(event) {
    this.setState({ inputValue: event.target.value });
  }

  handleKeyPress(event) {
    if (event.key === 'Enter' && this.state.inputValue !== '') {
      this.saveEdit();
    }
  }

  editLovedOne() {
    this.setState({ editMode: true, inputValue: this.props.lovedOne.name });
  }

  cancelEdit() {
    this.setState({ editMode: false });
  }

  saveEdit() {
    this.setState({ editMode: false });

    // edit in DB
  }

  render() {
    const { lovedOne } = this.props;

    let removeButton;
    let editButton;
    let saveButton;
    let lovedOneName;

    if (this.state.editMode === true) {
      removeButton = (
        <Button
          onClick={this.removeLovedOne}
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
          onClick={this.SaveEdit}
          text="Save"
        />
      );

      lovedOneName = (
        <Input
          value={this.state.inputValue}
          placeholder="Han Solo"
          onChange={this.handleChange}
          onKeyPress={this.handleKeyPress}
        />
      );
    } else {
      editButton = (
        <Button
          onClick={this.editLovedOne}
          text="Edit"
        />
      );

      lovedOneName = lovedOne.name;
    }

    return (
      <li>
        {lovedOneName}
        {removeButton}
        {editButton}
        {saveButton}
      </li>
    );
  }
}

LovedOne.propTypes = {
  lovedOne: PropTypes.shape({
    createdBy: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
};

export default LovedOne;
