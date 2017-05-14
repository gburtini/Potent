const { generators } = require('potent-tools');

module.exports = {
  simplify: require('./src/simplify'),
  get: (element) => {
    // returns the XPath array necessary for simplify from the given element.
    return generators.getElementTreeXPath(element, false);
  },
};
