import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { db } from '../firebase/firebase';
import Button from '../components/Button/Button';

class Reason extends Component {
  constructor(props) {
    super(props);

    this.state = { archivedReason: '' };

    this.removeArchivedReason = this.removeArchivedReason.bind(this);
  }

  removeArchivedReason() {
    const { archivedReason } = this.props;

    console.log(archivedReason.id);

    db
      .collection('archive')
      .doc(archivedReason.id)
      .delete();
  }


  render() {
    const { archivedReason } = this.props;

    return (
      <li>
        {archivedReason.name}
        <Button
          onClick={this.removeArchivedReason}
          text="Remove"
        />
      </li>
    );
  }
}

Reason.propTypes = {
  archivedReason: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
};

export default Reason;
