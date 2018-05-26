import React from 'react';
import PropTypes from 'prop-types';

const Input = ({ type, value, placeholder, onChange }) => (
  <input
    type={type}
    value={value}
    placeholder={placeholder}
    onChange={onChange}
  />
);

Input.propTypes = {
  type: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
};

Input.defaultProps = {
  type: 'text',
  value: '',
  placeholder: '',
  onChange: () => {},
};

export default Input;
