import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { db, auth } from '../firebase/firebase';
import ArchivedReason from './ArchivedReason';

class ArchivedReasons extends Component {
  constructor(props) {
    super(props);

    this.state = {
      archivedReasons: [],
    };
  }

  componentDidMount() {
    const { location } = this.props;
    // Getting reasons that were created by
    // the current user and created for the currently viewed loved one
    auth.onAuthStateChanged(user => {
      db
        .collection('archive')
        .where('createdBy', '==', user.email)
        .where(
          'createdFor',
          '==',
          location.location.state.location.state.lovedOne.id,
        )
        .orderBy('archivedAt', 'desc')
        .onSnapshot(
          call => {
            const archivedReasons = call.docs.map(doc => doc.data());
            this.setState({ archivedReasons });
          },
        );
    });
  }

  render() {
    const { location } = this.props;

    let archivedReasons;
    let lovedOneName = location.location.hash;
    lovedOneName = lovedOneName.replace('#', '');

    if (this.state.archivedReasons.length > 0) {
      archivedReasons = (
        this.state.archivedReasons.map((archivedReason) => (
          <ArchivedReason
            key={archivedReason.id}
            archivedReason={archivedReason}
          />
        ))
      );
    }

    return (
      <div>
        <p>You have sent the following reasons to {lovedOneName}</p>
        <ul>{archivedReasons}</ul>
      </div>
    );
  }
}

export default ArchivedReasons;

ArchivedReasons.propTypes = {
  location: PropTypes.shape({
    hash: PropTypes.string,
    key: PropTypes.string,
    pathname: PropTypes.string,
  }),
};

ArchivedReasons.defaultProps = {
  location: {
    hash: '',
    key: '',
    pathname: '',
  },
};
