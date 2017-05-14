const { ATTRIBUTE_SEPARATORS, IGNORED_ATTRIBUTES } = require('./config');

function isSeparatedAttribute(x) {
  if (ATTRIBUTE_SEPARATORS[x] !== undefined) return ATTRIBUTE_SEPARATORS[x];
  return false;
}

function isIgnoredAttribute(x) {
  return IGNORED_ATTRIBUTES.indexOf(x) !== -1;
}

module.exports = {
  isSeparatedAttribute,
  isIgnoredAttribute,
};
