import React, { Component } from 'react';

import * as firebase from 'firebase';

import { db } from '../firebase';
import byPropKey from '../utils/byPropKey';
import withAuthorization from '../utils/withAuthorization';
import Button from '../components/Button/Button';
import Input from '../components/Input/Input';
// import LovedOnes from '../components/LovedOnes/LovedOnes';

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };

    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  handleOnClick(event) {
    const {
      lovedOne,
    } = this.state;

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        db.addLovedOne(user.uid, lovedOne)
          .then(() => {
            this.setState(() => ({ ...INITIAL_STATE }));
          })
          .catch(error => {
            this.setState(byPropKey('error', error));
          });

        console.log(user);
      } else {
        // No user is signed in.
      }
    });

    event.preventDefault();
  }

  handleOnChange(event) {
    this.setState(byPropKey('lovedOne', event.target.value));
  }

  render() {
    const {
      lovedOne,
      error,
    } = this.state;

    const isInvalid = lovedOne === '';

    return (
      <div>
        <p>Welcome to iLoveYouBecause!</p>
        <Input
          value={lovedOne}
          onChange={this.handleOnChange}
          type="text"
          placeholder="John Doe"
        />
        <Button
          disabled={isInvalid}
          text="Add Loved One"
          type="submit"
          onClick={this.handleOnClick}
        />
        { error && <p>{error.message}</p> }
      </div>
    );
  }
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(Dashboard);
