const { generators, evaluators } = require('potent-tools');

function getDefaultDocument() {
  // eslint-disable-next-line no-undef
  if (document) return document;
  throw new Error(
    '`document` does not exist, specify a virtual document in `find`'
  );
}

module.exports = {
  // eslint-disable-next-line global-require
  simplify: require('./src/simplify'),
  get: (element) => {
    // returns the XPath array necessary for simplify from the given element.
    return generators.getElementTreeXPath(element, false);
  },
  find: (rule, doc = getDefaultDocument()) => {
    return evaluators.getElementsByXPath(doc, rule.toString());
  },
};
