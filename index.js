const { generators, evaluators } = require('potent-tools');

function getDefaultDocument() {
  if (document) return document;
  throw new Error('`document` does not exist, please specify a virtual document as the second argument to `find`');
}

module.exports = {
  simplify: require('./src/simplify'),
  get: (element) => {
    // returns the XPath array necessary for simplify from the given element.
    return generators.getElementTreeXPath(element, false);
  },
  find: (rule, doc = getDefaultDocument()) => {
    return evaluators.getElementsByXPath(doc, rule.toString());
  },
};
