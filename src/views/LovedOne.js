import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Paper from '@material-ui/core/Paper';
import Popover from '@material-ui/core/Popover';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import VertMenuIcon from '@material-ui/icons/MoreVert';

import * as routes from '../constants/routes';
import { db, auth } from '../firebase/firebase';
import Button from '../components/Button/Button';
import Input from '../components/Input/Input';

class LovedOne extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: '',
      disableSave: true,
      lovedOne: '',
      firstName: this.props.firstName,
      secondary: false,
      open: false,
      anchorEl: null,
    };

    this.removeLovedOne = this.removeLovedOne.bind(this);
    this.editLovedOne = this.editLovedOne.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
    this.saveEdit = this.saveEdit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.showContextMenu = this.showContextMenu.bind(this);
  }

  removeLovedOne() {
    const { lovedOne } = this.props;

    auth.onAuthStateChanged(user => {
      db
        .collection('users')
        .doc(user.email)
        .collection('lovedOnes')
        .doc(lovedOne.id)
        .delete();
    });
  }

  handleChange(event) {
    this.setState({ inputValue: event.target.value, disableSave: false });

    if (
      this.props.lovedOne.name === event.target.value ||
      event.target.value === ''
    ) {
      this.setState({ disableSave: true });
    }
  }

  editLovedOne() {
    this.setState({ editMode: true, inputValue: this.props.lovedOne.name });
  }

  cancelEdit() {
    this.setState({ editMode: false });
  }

  saveEdit() {
    const { lovedOne } = this.props;

    this.setState({ editMode: false });

    auth.onAuthStateChanged(user => {
      db
        .collection('users')
        .doc(user.email)
        .collection('lovedOnes')
        .doc(lovedOne.id)
        .update({
          name: this.state.inputValue,
        });
    });
  }

  showContextMenu() {

  }

  handleClick = event => {
    this.setState({
      anchorEl: event.currentTarget,
    });
  };

  handleClose = () => {
    this.setState({
      anchorEl: null,
    });
  };

  render() {
    const { lovedOne, firstName } = this.props;
    const { secondary, open, anchorEl } = this.state;

    let removeButton;
    let editButton;
    let saveButton;
    let lovedOneName;

    if (this.state.editMode === true) {
      removeButton = (
        <Button
          onClick={this.removeLovedOne}
          text="Remove"
        />
      );

      editButton = (
        <Button
          onClick={this.cancelEdit}
          text="Cancel"
        />
      );

      saveButton = (
        <Button
          onClick={this.saveEdit}
          text="Save"
          disabled={this.state.disableSave}
        />
      );

      lovedOneName = (
        <Input
          value={this.state.inputValue}
          placeholder="Han Solo"
          onChange={this.handleChange}
        />
      );
    } else {
      editButton = (
        <Button
          onClick={this.editLovedOne}
          text="Edit"
        />
      );

      lovedOneName = (
        <Link
          to={{
            pathname: `${routes.LOVEDONEPROFILE}`,
            hash: `#${lovedOne.name}`,
            state: { lovedOne, firstName },
          }}
        >
          {lovedOne.name}
        </Link>
      );
    }

    return (
      <ListItem>
        {editButton}
        {saveButton}
        <ListItemText
          primary={lovedOne.name}
          secondary={secondary ? 'Secondary text' : null}
        />
        <ListItemSecondaryAction>
          {/* <IconButton aria-label="Delete">
            <DeleteIcon onClick={this.removeLovedOne} />
          </IconButton>
          <IconButton aria-label="Go to loved one">
            <Link
              to={{
                pathname: `${routes.LOVEDONEPROFILE}`,
                hash: `#${lovedOne.name}`,
                state: { lovedOne, firstName },
              }}
            >
              {lovedOne.name}
              <ChevronRight />
            </Link>
          </IconButton> */}
          <IconButton aria-label="Loved One Context Menu">
            <VertMenuIcon
              aria-owns={open ? 'menu-list-grow' : null}
              aria-haspopup="true"
              onClick={this.handleClick}
            />
          </IconButton>
          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={this.handleClose}
            anchorOrigin={{
              vertical: 'center',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'center',
              horizontal: 'right',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={this.handleClose}>
                <MenuList>
                  <MenuItem onClick={this.handleClose}>Profile</MenuItem>
                  <MenuItem onClick={this.handleClose}>My account</MenuItem>
                  <MenuItem onClick={this.handleClose}>Logout</MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Popover>
        </ListItemSecondaryAction>
      </ListItem>
    );
  }
}

LovedOne.propTypes = {
  lovedOne: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  firstName: PropTypes.string.isRequired,
};

export default LovedOne;
