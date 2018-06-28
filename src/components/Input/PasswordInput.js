import React, { Component } from 'react';
import PropTypes from 'prop-types';

import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import newId from '../../utils/newId';

class PasswordInput extends Component {
  constructor(props) {
    super(props);

    this.state = { showPassword: false };
    this.id = newId();
  }

  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };

  handleMouseDownPassword = event => {
    event.preventDefault();
  };

  render() {
    const {
      value,
      onChange,
    } = this.props;

    const { showPassword } = this.state;

    return (
      <FormControl>
        <InputLabel htmlFor={this.id}>Password</InputLabel>
        <Input
          id={this.id}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="Toggle password visibility"
                onClick={this.handleClickShowPassword}
                onMouseDown={this.handleMouseDownPassword}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
    );
  }
}

PasswordInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};

PasswordInput.defaultProps = {
  value: '',
  onChange: () => {},
};

export default PasswordInput;
