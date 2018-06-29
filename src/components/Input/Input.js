import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';

import newId from '../../utils/newId';
import './Input.css';

class Input extends Component {
  constructor(props) {
    super(props);

    this.id = newId();
  }

  render() {
    const {
      type,
      value,
      placeholder,
      onChange,
      onKeyPress,
      label,
    } = this.props;

    return (
      <div className="inputContainer">
        <TextField
          type={type}
          id={this.id}
          label={label}
          placeholder={placeholder}
          onChange={onChange}
          onKeyPress={onKeyPress}
          value={value}
          className="input"
        />
      </div>
    );
  }
}

Input.propTypes = {
  type: PropTypes.string,
  label: PropTypes.string,
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
  label: null,
};

export default Input;
