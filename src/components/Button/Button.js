import React from 'react';
import PropTypes from 'prop-types';
import MaterialButton from '@material-ui/core/Button';

const Button = ({ text, onClick, type, disabled, size }) => (
  <MaterialButton
    variant="contained"
    color="primary"
    type={type}
    onClick={onClick}
    disabled={disabled}
    size={size}
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
};

Button.defaultProps = {
  type: 'button',
  disabled: false,
  onClick: () => {},
  size: 'normal',
};

export default Button;
