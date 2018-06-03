import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { db, auth } from '../firebase/firebase';
import withAuthorization from '../utils/withAuthorization';

class LovedOneProfile extends Component {
  constructor(props) {
    super(props);


  }


  render() {
    const { location } = this.props;

    let lovedOne = location.hash;

    // Removing all # symbols in location.hash
    lovedOne = lovedOne.replace('#','');

    return (
      <div>
        <h1>This is {lovedOne}'s profile</h1>
        <h2>Here are the reasons why you love this person:</h2>
      </div>
    );
  }
}



const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(withRouter(LovedOneProfile));
