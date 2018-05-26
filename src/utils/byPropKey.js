const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

export default byPropKey;
