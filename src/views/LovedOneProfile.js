import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import { db, auth } from '../firebase/firebase';
import withAuthorization from '../utils/withAuthorization';
import Button from '../components/Button/Button';
import Input from '../components/Input/Input';

class LovedOneProfile extends Component {
  constructor(props) {
    super(props);

    this.handleChangeReason = this.handleChangeReason.bind(this);
    this.handleKeyPressReason = this.handleKeyPressReason.bind(this);
    this.addReason = this.addReason.bind(this);
    this.editReason = this.editReason.bind(this);

    this.state = {
      reasons: [],
      inputValueReason: '',
    };
  }

  componentDidMount() {
    const { location } = this.props;

    auth.onAuthStateChanged(user => {
      db
        .collection('users')
        .doc(`${user.email}`)
        .collection('lovedOnes')
        .doc(location.state.lovedOne.id)
        .collection('reasons')
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
        .collection('users')
        .doc(user.email)
        .collection('lovedOnes')
        .doc(location.state.lovedOne.id)
        .collection('reasons')
        .doc();

      newReason.set({
        name: this.state.inputValueReason,
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

  editReason() {
    this.setState({ editMode: true, inputValueReason: this.props.reason.name });
  }

  render() {
    const { location } = this.props;

    let reasons;
    let inputValid;
    let reasonBlurb;

    const lovedOneName = location.state.lovedOne.name;
    const lovedOneEmail = location.state.lovedOne.email;

    if (this.state.reasons.length > 0) {
      reasons = (
        this.state.reasons.map((reason) => (
          <li key={reason.id}>{reason.name}</li>
        ))
      );

      reasonBlurb = 'Here are the reasons why you love this person:';
    } else {
      reasonBlurb = `Add some reasons why you love ${lovedOneName}`;
    }

    if (this.state.inputValueReason === '') {
      inputValid = false;
    } else {
      inputValid = true;
    }

    return (
      <div>
        {/* <Button
          onClick={this.editLovedOne}
          text="Edit"
        /> */}
        <p>Name: {lovedOneName}</p>
        <p>Email: {lovedOneEmail}</p>
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
