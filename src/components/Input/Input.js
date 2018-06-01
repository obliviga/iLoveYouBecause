import React from 'react';
import PropTypes from 'prop-types';

const Input = ({ type, value, placeholder, onChange, onKeyPress }) => (
  <input
    type={type}
    value={value}
    placeholder={placeholder}
    onChange={onChange}
    onKeyPress={onKeyPress}
  />
);

Input.propTypes = {
  type: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  onKeyPress: PropTypes.func,
};

Input.defaultProps = {
  type: 'text',
  value: '',
  placeholder: '',
  onChange: () => {},
  onKeyPress: () => {},
};

export default Input;
