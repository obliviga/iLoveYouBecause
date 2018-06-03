import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import * as routes from '../../constants/routes';
import { db, auth } from '../../firebase/firebase';
import Button from '../Button/Button';
import Input from '../Input/Input';

class LovedOne extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      inputValue: '',
      disableSave: true,
    };

    this.removeLovedOne = this.removeLovedOne.bind(this);
    this.editLovedOne = this.editLovedOne.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
    this.saveEdit = this.saveEdit.bind(this);
    this.handleChange = this.handleChange.bind(this);
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
    this.setState({ inputValue: event.target.value, disableSave: false });

    if (
      this.props.lovedOne.name === event.target.value ||
      event.target.value === ''
    ) {
      this.setState({ disableSave: true });
    }
  }

  editLovedOne() {
    this.setState({ editMode: true, inputValue: this.props.lovedOne.name });
  }

  cancelEdit() {
    this.setState({ editMode: false });
  }

  saveEdit() {
    const { lovedOne } = this.props;

    this.setState({ editMode: false });

    auth.onAuthStateChanged(user => {

      db
        .collection('users')
        .doc(user.email)
        .collection('lovedOnes')
        .doc(lovedOne.id)
        .update({
          name: this.state.inputValue,
        });
    });
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
          onClick={this.saveEdit}
          text="Save"
          disabled={this.state.disableSave}
        />
      );

      lovedOneName = (
        <Input
          value={this.state.inputValue}
          placeholder="Han Solo"
          onChange={this.handleChange}
        />
      );
    } else {
      editButton = (
        <Button
          onClick={this.editLovedOne}
          text="Edit"
        />
      );

      lovedOneName = (
        <Link
          to={`${routes.LOVEDONEPROFILE}#${lovedOne.name}`}
        >
          {lovedOne.name}
        </Link>
      );
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
    id: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
};

export default LovedOne;
