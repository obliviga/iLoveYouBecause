import React, { Component } from 'react';

import * as firebase from 'firebase';

import { db } from '../firebase';
import byPropKey from '../utils/byPropKey';
import withAuthorization from '../utils/withAuthorization';
import Button from '../components/Button/Button';
import Input from '../components/Input/Input';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      error: null,
      users: null,
      lovedOne: '',
      lovedOnes: null,
    };

    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.updateLovedOnes = this.updateLovedOnes.bind(this);
  }

  componentDidMount() {
    this.updateLovedOnes();
  }

  componentWillUnmount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log(user.uid);
      } else {
        console.log(user);
      }
    });
  }

  updateLovedOnes() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log(user.uid);
        db.getLovedOnes(user.uid)
          .then(snapshot =>
            this.setState(() => ({ lovedOnes: snapshot.val() })),
          );
      } else {
        this.setState({ lovedOnes: '' });
      }
    });
  }

  handleOnClick(event) {
    const {
      lovedOne,
    } = this.state;

    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        db.addLovedOne(user.uid, lovedOne)
          .then(() => {
            this.setState(() => ({
              email: '',
              password: '',
              error: null,
              users: null,
              lovedOne: '',
              lovedOnes: null,
            }));
            this.updateLovedOnes();
          })
          .catch(error => {
            this.setState(byPropKey('error', error));
          });
      } else {
        unsubscribe();
      }
    });

    event.preventDefault();
  }

  // removeLovedOne(event) {
  //   const {
  //     lovedOne,
  //   } = this.state;
  //
  //   firebase.auth().onAuthStateChanged((user) => {
  //     if (user) {
  //       db.addLovedOne(user.uid, lovedOne)
  //         .then(() => {
  //           this.setState(() => ({ ...INITIAL_STATE }));
  //           this.updateLovedOnes();
  //         })
  //         .catch(error => {
  //           this.setState(byPropKey('error', error));
  //         });
  //     } else {
  //       // No user is signed in.
  //     }
  //   });
  //
  //   event.preventDefault();
  // }

  handleOnChange(event) {
    this.setState(byPropKey('lovedOne', event.target.value));
  }

  render() {
    const {
      lovedOne,
      error,
      lovedOnes,
    } = this.state;

    const isInvalid = lovedOne === '';

    const ListOfLovedOnes = ({ lovedOnes }) => (
      <div>
        {Object.keys(lovedOnes).map(key => (
          <div key={key}>
            {lovedOnes[key].lovedOne}
          </div>
        ))}
      </div>
    );

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
          onClick={this.handleOnClick}
        />
        { error && <p>{error.message}</p> }

        <p>Here are your loved ones:</p>
        { !!lovedOnes && <ListOfLovedOnes lovedOnes={lovedOnes} /> }
      </div>
    );
  }
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(Dashboard);
