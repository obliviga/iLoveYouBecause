import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { EmoticonSad, EmoticonHappy } from 'mdi-material-ui';
import MaterialSnackbar from '@material-ui/core/Snackbar';

import './SnackBar.css';

class SnackBar extends PureComponent {
  render() {
    const {
      open,
      autoHideDuration,
      onClose,
      verticleposition,
      horizontalposition,
      variant,
      messageText,
    } = this.props;

    let messageContent;

    if (variant === 'error') {
      messageContent = (
        <div className="messageContainer">
          <EmoticonSad />
          <p className="message">{messageText}</p>
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        </div>
      );
    } else {
      messageContent = (
        <div className="messageContainer">
          <EmoticonHappy />
          <p className="message">{messageText}</p>
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        </div>
      );
    }

    return (
      <MaterialSnackbar
        className={`snackbarContainer ${variant}`}
        anchorOrigin={{
          vertical: verticleposition,
          horizontal: horizontalposition,
        }}
        open={open}
        autoHideDuration={autoHideDuration}
        onClose={onClose}
        verticleposition={verticleposition}
        horizontalposition={horizontalposition}
        message={messageContent}
      />
    );
  }
}

export default SnackBar;

SnackBar.propTypes = {
  open: PropTypes.bool,
  autoHideDuration: PropTypes.number,
  onClose: PropTypes.func,
  verticleposition: PropTypes.string,
  horizontalposition: PropTypes.string,
  variant: PropTypes.oneOf(['normal', 'success', 'error']),
  messageText: PropTypes.string,
};

SnackBar.defaultProps = {
  autoHideDuration: 6000,
  variant: 'normal',
  open: true,
  verticleposition: 'top',
  horizontalposition: 'left',
  onClose: () => {},
  messageText: 'Something went wrong.',
};
