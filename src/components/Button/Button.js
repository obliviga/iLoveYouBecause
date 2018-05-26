import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ text, onClick, type }) => (
  <button type={type} onClick={onClick}>
    {text}
  </button>
);

Button.propTypes = {
  type: PropTypes.string,
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

Button.defaultProps = {
  type: 'button',
  disabled: false,
};

export default Button;
