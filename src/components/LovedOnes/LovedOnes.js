import React from 'react';

import User from '../../components/LovedOne/LovedOne';

class LovedOnes extends React.Component {
  constructor(props) {
    super(props);

    this.handleOnClick = this.handleOnClick.bind(this);
  }

  handleOnClick() {
    console.log('add loved one');
  }

  render() {
    const users = {
      tom: {
        phone: '123',
        email: 'hotmail',
      },
      rob: {
        phone: '321',
        email: 'yahoo',
      },
      bob: {
        phone: '333',
        email: 'gmail',
      },
    };

    const list = Object.entries(users).map(([name, info]) =>
      (<User
        name={name}
        phone={info.phone}
        email={info.email}
      />),
    );

    return <ul>{list}</ul>;
  }
}

export default LovedOnes;
