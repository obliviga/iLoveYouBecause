import React from 'react';
import PropTypes from 'prop-types';
import MaterialButton from '@material-ui/core/Button';

import './Button.css';

const Button = ({ text, onClick, type, disabled, size, fullWidth }) => (
  <MaterialButton
    variant="contained"
    color="primary"
    type={type}
    onClick={onClick}
    disabled={disabled}
    size={size}
    fullWidth={fullWidth}
  >
    {text}
  </MaterialButton>
);

Button.propTypes = {
  type: PropTypes.string,
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  size: PropTypes.string,
  fullWidth: PropTypes.bool,
};

Button.defaultProps = {
  type: 'button',
  disabled: false,
  onClick: () => {},
  size: 'normal',
  fullWidth: false,
};

export default Button;
