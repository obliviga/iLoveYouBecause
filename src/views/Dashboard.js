import React, { Component } from 'react';

import { db, auth } from '../firebase/firebase';
import withAuthorization from '../utils/withAuthorization';
import Button from '../components/Button/Button';
import Input from '../components/Input/Input';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lovedOnes: null,
      user: null,
      inputValue: '',
    };
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

  handleChange = (event) => {
    this.setState({ inputValue: event.target.value });
  }

  handleKeyPress = (event) => {
    if (event.key === 'Enter' && this.state.inputValue !== '') {
      this.addLovedOne();
    }
  }

  addLovedOne = () => {
    auth.onAuthStateChanged(user => {
      const newLovedOne = db
        .collection('users')
        .doc(user.email)
        .collection('lovedOnes')
        .doc();

      newLovedOne.set({
        name: this.state.inputValue,
        id: newLovedOne.id,
        createdBy: this.state.user.uid,
      });

      this.setState({ inputValue: '' });
    });
  }

  removeLovedOne = lovedOne => {
    auth.onAuthStateChanged(user => {
      db
        .collection('users')
        .doc(user.email)
        .collection('lovedOnes')
        .doc(lovedOne.id)
        .delete();
    });
  }

  render() {
    let lovedOnes;
    let inputValid;

    if (this.state.lovedOnes) {
      lovedOnes = (
        this.state.lovedOnes.map((lovedOne, index) => (
          <li key={index}>
            {lovedOne.name}
            <Button
              onClick={() => this.removeLovedOne(lovedOne)}
              text="Remove"
            />
          </li>
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
        <Input
          value={this.state.inputValue}
          placeholder="Jyn Erso"
          onChange={this.handleChange}
          onKeyPress={this.handleKeyPress}
        />
        <Button
          onClick={this.addLovedOne}
          text="Add"
          disabled={!inputValid}
        />
        <p>Here are your loved ones:</p>
        <ul>{lovedOnes}</ul>
      </div>
    );
  }
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(Dashboard);
