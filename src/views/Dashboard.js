import React, { Component } from 'react';

import { db, auth } from '../firebase/firebase';
import withAuthorization from '../utils/withAuthorization';
import Button from '../components/Button/Button';
import Input from '../components/Input/Input';
import LovedOne from '../components/LovedOne/LovedOne';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lovedOnes: [],
      nameInputValue: '',
      emailInputValue: '',
    };

    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleKeyPressName = this.handleKeyPressName.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleKeyPressEmail = this.handleKeyPressEmail.bind(this);
    this.addLovedOne = this.addLovedOne.bind(this);
  }

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      db
        .collection('users')
        .doc(`${user.email}`)
        .collection('lovedOnes')
        .onSnapshot(
          call => {
            const lovedOnes = call.docs.map(doc => doc.data());
            this.setState({ lovedOnes });
          },
        );

      this.setState({ user });
    });
  }

  handleChangeName(event) {
    this.setState({ nameInputValue: event.target.value });
  }

  handleKeyPressName(event) {
    const keyPressValidation = event.key === 'Enter' &&
      this.state.nameInputValue !== '' &&
      this.state.emailInputValue !== '';

    if (keyPressValidation) {
      this.addLovedOne();
    }
  }

  handleChangeEmail(event) {
    this.setState({ emailInputValue: event.target.value });
  }

  handleKeyPressEmail(event) {
    const keyPressValidation = event.key === 'Enter' &&
      this.state.nameInputValue !== '' &&
      this.state.emailInputValue !== '';

    if (keyPressValidation) {
      this.addLovedOne();
    }
  }

  addLovedOne() {
    auth.onAuthStateChanged(user => {
      const newLovedOne = db
        .collection('users')
        .doc(user.email)
        .collection('lovedOnes')
        .doc();

      newLovedOne.set({
        name: this.state.nameInputValue,
        email: this.state.emailInputValue,
        id: newLovedOne.id,
      });

      this.setState({
        nameInputValue: '',
        emailInputValue: '',
      });
    });
  }

  render() {
    let lovedOnes;
    let inputsValid;
    let welcomeBlurb;

    if (this.state.lovedOnes.length > 0) {
      lovedOnes = (
        this.state.lovedOnes.map((lovedOne) => (
          <LovedOne key={lovedOne.id} lovedOne={lovedOne} />
        ))
      );

      welcomeBlurb = 'Here are your loved ones:';
    } else {
      welcomeBlurb = 'Feel free to add some loved ones.';
    }

    if (this.state.nameInputValue === '' || this.state.emailInputValue === '') {
      inputsValid = false;
    } else {
      inputsValid = true;
    }

    return (
      <div>
        <Input
          value={this.state.nameInputValue}
          placeholder="Jyn Erso"
          onChange={this.handleChangeName}
          onKeyPress={this.handleKeyPressName}
        />
        <Input
          type="email"
          value={this.state.emailInputValue}
          placeholder="jyn.erso@rogueone.com"
          onChange={this.handleChangeEmail}
          onKeyPress={this.handleKeyPressEmail}
        />
        <Button
          onClick={this.addLovedOne}
          text="Add"
          disabled={!inputsValid}
        />
        <h2>{welcomeBlurb}</h2>
        <ul>{lovedOnes}</ul>
      </div>
    );
  }
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(Dashboard);
