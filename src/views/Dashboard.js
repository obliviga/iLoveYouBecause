import React, { Component } from 'react';

import { db, auth } from '../firebase/firebase';

import withAuthorization from '../utils/withAuthorization';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.addLovedOne = this.addLovedOne.bind(this);

    this.state = {
      lovedOnes: null,
      user: null,
    };
  }

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      console.log(user);
      db
        .collection('users')
        .doc(`${user.email}`)
        .collection('lovedOnes')
        .onSnapshot(
          call => {
            const lovedOnes = call.docs.map(doc => doc.data());
            console.log(call);
            this.setState({ lovedOnes });
          },
        );

      this.setState({ user });
    });
  }

  addLovedOne(event) {
    event.preventDefault();

    auth.onAuthStateChanged(user => {
      const newSuggestion = db
        .collection('users')
        .doc(`${user.email}`)
        .collection('lovedOnes')
        .doc();

      newSuggestion.set({
        name: this.addLovedOneInput.value,
        id: newSuggestion.id,
        createdBy: this.state.user.uid,
      });

      this.addLovedOneInput.value = null;
    });
  }

  render() {
    let lovedOnes;

    if (this.state.lovedOnes) {
      lovedOnes = (
        this.state.lovedOnes.map((lovedOne, index) => (
          <li key={index}>
            {lovedOne.name}
          </li>
        ))
      );
    }

    return (
      <div>
        <form onSubmit={event => this.addLovedOne(event)}>
          <input
            type="text"
            ref={input => {
              this.addLovedOneInput = input;
            }}
          />
          <button type="submit">Submit</button>
        </form>
        <p>Here are your loved ones:</p>
        <ul>{lovedOnes}</ul>
      </div>
    );
  }
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(Dashboard);
