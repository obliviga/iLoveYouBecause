import React, { Component } from 'react';

import { db, auth } from '../firebase/firebase';

import withAuthorization from '../utils/withAuthorization';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lovedOnes: null,
      user: null,
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

  addLovedOne = () => {
    auth.onAuthStateChanged(user => {
      const newLovedOne = db
        .collection('users')
        .doc(user.email)
        .collection('lovedOnes')
        .doc();

      newLovedOne.set({
        name: this.addLovedOneInput.value,
        id: newLovedOne.id,
        createdBy: this.state.user.uid,
      });

      this.addLovedOneInput.value = null;
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

    if (this.state.lovedOnes) {
      lovedOnes = (
        this.state.lovedOnes.map((lovedOne, index) => (
          <li key={index}>
            {lovedOne.name}
            <button onClick={() => this.removeLovedOne(lovedOne)}>
              Remove
            </button>
          </li>
        ))
      );
    }

    return (
      <div>
        <input
          type="text"
          ref={input => {
            this.addLovedOneInput = input;
          }}
        />
        <button onClick={() => this.addLovedOne()}>
          Submit
        </button>
        <p>Here are your loved ones:</p>
        <ul>{lovedOnes}</ul>
      </div>
    );
  }
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(Dashboard);
