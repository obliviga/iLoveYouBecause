import React, { Component } from 'react';

import withAuthorization from '../utils/withAuthorization';
import Button from '../components/Button/Button';
// import LovedOnes from '../components/LovedOnes/LovedOnes';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.handleOnClick = this.handleOnClick.bind(this);
  }

  handleOnClick() {
    console.log('add lobed one');
  }

  render() {
    return (
      <div>
        <p>Welcome to iLoveYouBecause!</p>
        <Button
          text="Add Loved One"
          onClick={this.handleOnClick}
        />
        {/* <LovedOnes /> */}
      </div>
    );
  }
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(Dashboard);
