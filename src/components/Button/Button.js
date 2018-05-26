import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ text, onClick, type, disabled }) => (
  <button type={type} onClick={onClick} disabled={disabled}>
    {text}
  </button>
);

Button.propTypes = {
  type: PropTypes.string,
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

Button.defaultProps = {
  type: 'button',
  disabled: false,
  onClick: () => {},
};

export default Button;
