import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import * as routes from '../constants/routes';
import { db, auth } from '../firebase/firebase';
import withAuthorization from '../utils/withAuthorization';
import Button from '../components/Button/Button';
import Input from '../components/Input/Input';
import Reason from './Reason';

class LovedOneProfile extends Component {
  constructor(props) {
    super(props);

    const { location } = this.props;

    this.handleChangeReason = this.handleChangeReason.bind(this);
    this.handleChangeLovedOneName = this.handleChangeLovedOneName.bind(this);
    this.handleChangeLovedOneEmail = this.handleChangeLovedOneEmail.bind(this);
    this.handleKeyPressReason = this.handleKeyPressReason.bind(this);
    this.addReason = this.addReason.bind(this);
    this.editLovedOne = this.editLovedOne.bind(this);
    this.cancelEditLovedOne = this.cancelEditLovedOne.bind(this);
    this.saveLovedOne = this.saveLovedOne.bind(this);

    this.state = {
      reasons: [],
      archivedReasons: [],
      inputValueReason: '',
      inputValueLovedOneName: location.state.lovedOne.name,
      inputValueLovedOneEmail: location.state.lovedOne.email,
      editMode: false,
      location: this.props.location,
    };
  }

  componentDidMount() {
    const { location } = this.props;
    // Getting reasons that were created by
    // the current user and created for the currently viewed loved one
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

      db
        .collection('archive')
        .where('createdBy', '==', user.email)
        .where('createdFor', '==', location.state.lovedOne.id)
        .orderBy('archivedAt', 'desc')
        .onSnapshot(
          call => {
            const archivedReasons = call.docs.map(doc => doc.data());
            this.setState({ archivedReasons });
          },
        );
    });
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

    // When loved one's info is saved, should exit edit mode
    this.setState({ editMode: false });
  }

  render() {
    const { location } = this.props;

    let reasonsList;
    let inputValid;
    let reasonBlurb;
    let editLovedOneButton;
    let saveLovedOneButton;
    let lovedOneName = this.state.inputValueLovedOneName;
    let lovedOneEmail = this.state.inputValueLovedOneEmail;
    let linkToArchive;

    if (this.state.reasons.length > 0) {
      reasonsList = (
        this.state.reasons.map((reason) => (
          <Reason
            key={reason.id}
            reason={reason}
            sent={location.state.lovedOne.sent}
            location={location}
          />
        ))
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

    if (this.state.archivedReasons.length > 0) {
      linkToArchive = (
        <Link
          to={{
            pathname: routes.ARCHIVEDREASONS,
            hash: `#${lovedOneName}`,
            state: { location },
          }}
        >
          Sent Reasons
        </Link>
      );
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
        <ul>{reasonsList}</ul>
        {linkToArchive}
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
