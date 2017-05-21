const {
  isSeparatedAttribute,
  splitAttribute,
} = require('separated-attributes');
const { COSTS } = require('./config');
const { isIgnoredAttribute } = require('./helpers');
const potentTools = require('potent-tools');

const XPathQuery = potentTools.types.XPathQuery;
const XPathNode = potentTools.types.XPathNode;

function commonValues(arr1, arr2) {
  let cost = 0;

  // TODO: rewrite this, it is yuck.
  const arr = arr1.filter((n) => {
    if (arr2.indexOf(n) === -1) {
      cost += COSTS.VALUE;
      return false;
    }
    return true;
  });

  return { common: arr, cost };
}

function commonIndex(Lindex, Rindex) {
  return Lindex === Rindex
    ? { common: Lindex, cost: 0 }
    : { common: null, cost: COSTS.INDEX };
}

function commonAttributes(Lattributes, Rattributes) {
  const leftAttributes = Object.assign({}, Lattributes);
  const rightAttributes = Object.assign({}, Rattributes);
  if (!leftAttributes || !rightAttributes) return { common: {}, cost: null };

  const attributes = {};
  let cost = 0;

  // TODO: make this a reduce instead.
  Object.keys(leftAttributes).forEach((attribute) => {
    if (
      leftAttributes[attribute] === undefined ||
      rightAttributes[attribute] === undefined
    ) {
      // TODO: this screws up the cost a bit.
      return;
    }
    if (isIgnoredAttribute(attribute)) return;
    if (isSeparatedAttribute(attribute)) {
      // this is a separated attribute, so split it in to its pieces.
      // e.g., class names are space separated: "button green-button".

      const values = commonValues(
        splitAttribute(attribute, leftAttributes[attribute]),
        splitAttribute(attribute, rightAttributes[attribute])
      );

      attributes[attribute] = values.common;
      cost += values.cost;
    } else if (leftAttributes[attribute] === rightAttributes[attribute]) {
      // not a separated attribute, compare identically
      // TODO: actually want to compare deep here.
      attributes[attribute] = leftAttributes[attribute];
    } else {
      cost += COSTS.ATTRIBUTE;
    }
  });

  return { common: attributes, cost };
}

function commonTag(Ltag, Rtag) {
  let tag;
  let cost = 0;
  if (Ltag === Rtag) {
    tag = Ltag;
  } else if (Ltag === '' || Rtag === '') {
    // TODO: explain empty case.
    tag = '';
  } else if (Ltag === '*' || Rtag === '*') {
    // handle wildcard/star case.
    tag = '*';
  } else {
    // handle doesn't match at all...
    // TODO: can do 'better' here with an or list and an associated max threshold.
    tag = '*';
    cost = COSTS.TAG;
  }

  return { common: tag, cost };
}

function commonNodes(L, R) {
  const tag = commonTag(L.tag, R.tag);
  const attributes = commonAttributes(L.attributes, R.attributes);
  const index = commonIndex(L.index, R.index);
  // TODO: const elements = L.elements.concat(R.elements);

  const node = {
    tag: tag.common,
    attributes: attributes.common,
    index: index.common,
    // elements: elements
  };

  return {
    common: node,
    cost: tag.cost + attributes.cost + index.cost,
  };
}

function commonXPath(a, b) {
  // TODO: why are these called a and b, everywhere else they're called L and R.
  if (a.length > b.length) {
    // here we can trust a to always be the smallest.
    return commonXPath(b, a);
  }

  return a.reduce(
    (result, value, index) => {
      // TODO: if they're not the same length, what happens here?
      const node = commonNodes(a[index], b[index]);
      return {
        cost: result.cost + node.cost,
        common: [...result.common, node.common],
      };
    },
    { cost: 0, common: [] }
  );
}

// this takes the return value of potent-tools::generators.getElementTreeXPath
// when asString is passed as false.
function simplifyXPath(arrayOfNodes) {
  // TODO: sum a cost here.
  // TODO: rewrite functionally.
  function getSimpleNodeObject(obj) {
    if (obj instanceof XPathQuery) return obj.nodes;
    if (obj instanceof Array) return obj;
    if (obj instanceof String) return XPathQuery.fromString(obj);
    throw new Error('Invalid type passed to simplify,');
  }
  let current = getSimpleNodeObject(arrayOfNodes[0]);
  for (let i = 1; i < arrayOfNodes.length; i++) {
    const currentNode = getSimpleNodeObject(arrayOfNodes[i]);
    current = commonXPath(current, currentNode).common;
  }

  return new XPathQuery(current.map(i => new XPathNode(i)));
}

module.exports = simplifyXPath;
