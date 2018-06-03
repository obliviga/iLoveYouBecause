import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { db, auth } from '../firebase/firebase';
import withAuthorization from '../utils/withAuthorization';
import Button from '../components/Button/Button';
import Input from '../components/Input/Input';

class LovedOneProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      reasons: [],
      inputValue: '',
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

  addReason = () => {
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
        name: this.state.inputValue,
        id: newReason.id,
      });

      this.setState({
        inputValue: '',
      });
    });
  }

  handleChange = (event) => {
    this.setState({ inputValue: event.target.value });
  }

  handleKeyPress = (event) => {
    if (event.key === 'Enter' && this.state.inputValue !== '') {
      this.addReason();
    }
  }

  render() {
    const { location } = this.props;

    let reasons;
    let inputValid;

    const lovedOneName = location.state.lovedOne.name;

    if (this.state.reasons.length > 0) {
      reasons = (
        this.state.reasons.map((reason) => (
          <li key={reason.id}>{reason.name}</li>
        ))
      );
    }

    if (this.state.inputValue === '') {
      inputValid = false;
    } else {
      inputValid = true;
    }

    return (
      <div>
        <h1>This is {lovedOneName}&apos;s profile</h1>
        <Input
          value={this.state.inputValue}
          placeholder="Because your hair is awesome"
          onChange={this.handleChange}
          onKeyPress={this.handleKeyPress}
        />
        <Button
          onClick={this.addReason}
          text="Add"
          disabled={!inputValid}
        />
        <h2>Here are the reasons why you love this person:</h2>
        <ul>{reasons}</ul>
      </div>
    );
  }
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(withRouter(LovedOneProfile));
