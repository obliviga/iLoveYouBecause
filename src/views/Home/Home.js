import React from 'react';
// import PropTypes from 'prop-types';

import Button from '../../components/Button/Button';

export default class Home extends React.Component {
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
      </div>
    );
  }
}

// Home.propTypes = {
//   handleOnClick: PropTypes.func,
// };
//
// Home.defaultProps = {
//   handleOnClick: (this.handleOnClick),
// };
