import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';

import newId from '../../utils/newId';

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
      margin,
    } = this.props;

    return (
      <TextField
        type={type}
        id={this.id}
        label={label}
        placeholder={placeholder}
        margin={margin}
        onChange={onChange}
        onKeyPress={onKeyPress}
        value={value}
      />
    );
  }
}

Input.propTypes = {
  type: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  margin: PropTypes.string,
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
  margin: 'normal',
};

export default Input;
