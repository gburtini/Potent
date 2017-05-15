const { IGNORED_ATTRIBUTES } = require('./config');

function isIgnoredAttribute(x) {
  return IGNORED_ATTRIBUTES.indexOf(x) !== -1;
}

module.exports = {
  isIgnoredAttribute,
};
