import React from 'react';
import PropTypes from 'prop-types';

class LovedOne extends React.Component {
  render() {
    const {
      name,
      phone,
      email,
    } = this.props;

    const info = [name, phone, email];

    const item = info.map((index) => (
      <li key={index}>
        { index }
      </li>
    ));

    return item;
  }
}

LovedOne.propTypes = {
  name: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
};

export default LovedOne;
