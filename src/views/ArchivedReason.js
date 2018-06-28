import React from 'react';
import PropTypes from 'prop-types';

const ArchivedReason = (props) => (
  <li>{props.archivedReason.name}</li>
);

export default ArchivedReason;

ArchivedReason.propTypes = {
  archivedReason: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
};
