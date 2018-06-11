import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

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
      inputValueReason: '',
      inputValueLovedOneName: location.state.lovedOne.name,
      inputValueLovedOneEmail: location.state.lovedOne.email,
      editMode: false,
    };
  }

  componentDidMount() {
    const { location } = this.props;

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

  addReason() {
    const { location } = this.props;

    auth.onAuthStateChanged(user => {
      const newReason = db
        .collection('reasons')
        .doc();

      newReason.set({
        name: this.state.inputValueReason,
        createdAt: Date.now(),
        createdFor: location.state.lovedOne.id,
        createdBy: user.email,
        id: newReason.id,
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

  render() {
    const { location } = this.props;

    let reasons;
    let inputValid;
    let reasonBlurb;
    let editLovedOneButton;
    let saveLovedOneButton;
    let lovedOneName = this.state.inputValueLovedOneName;
    let lovedOneEmail = this.state.inputValueLovedOneEmail;

    if (this.state.reasons.length > 0) {
      reasons = (
        this.state.reasons.map((reason) => (
          <Reason
            key={reason.id}
            reason={reason}
          />
        ))
      );

      reasonBlurb = `Here are the reasons why you love ${lovedOneName}:`;
    } else {
      reasonBlurb = `Add some reasons why you love ${lovedOneName}`;
    }

    if (this.state.inputValueReason === '') {
      inputValid = false;
    } else {
      inputValid = true;
    }

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
        <h2>{reasonBlurb}</h2>
        <ul>{reasons}</ul>
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
