import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { Link } from 'react-router-dom';

import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import ListItem from '@material-ui/core/ListItem';
import Paper from '@material-ui/core/Paper';
import { ChevronRight } from 'mdi-material-ui';

import DelayLink from '../utils/delayLink';
import './LovedOne.css';

import * as routes from '../constants/routes';
import { db, auth } from '../firebase/firebase';

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

  render() {
    const { lovedOne } = this.props;

    return (
      <DelayLink
        to={{
          pathname: `${routes.LOVEDONEPROFILE}`,
          hash: `#${lovedOne.name}`,
          state: { lovedOne },
        }}
        delay={300}
      >
        <Paper className="lovedOne">
          <ButtonBase>
            <ListItem className="listItem">
              <Typography variant="subheading">
                {lovedOne.name}
              </Typography>
              <ChevronRight />
            </ListItem>
          </ButtonBase>
        </Paper>
      </DelayLink>
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
