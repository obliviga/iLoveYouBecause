import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { db, auth } from '../../firebase/firebase';
import Button from '../Button/Button';

class LovedOne extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
    };

    this.removeLovedOne = this.removeLovedOne.bind(this);
  }

  removeLovedOne() {
    const {
      lovedOne,
    } = this.props;

    auth.onAuthStateChanged(user => {
      db
        .collection('users')
        .doc(user.email)
        .collection('lovedOnes')
        .doc(lovedOne.id)
        .delete();
    });
  }


  editLovedOne() {
    this.setState({ editMode: true });
  }

  render() {
    const { children, lovedOne } = this.props;

    let removeButton;

    const editButton = (
      <Button
        onClick={() => this.editLovedOne(lovedOne)}
        text="Edit"
      />
    );

    if (this.state.editMode === true) {
      removeButton = (
        <Button
          onClick={() => this.removeLovedOne(lovedOne)}
          text="Remove"
        />
      );
    }

    return (
      <li>
        {children}
        {removeButton}
        {editButton}
      </li>
    );
  }
}

LovedOne.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

LovedOne.defaultProps = {
  children: null,
};

export default LovedOne;
