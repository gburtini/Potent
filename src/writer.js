// TODO: these belong in potent-tools as the function that generates these objects is there.
const { splitAttributes } = require('separated-attributes');

function attributesToXPath(attributes) {
  let ret = '';
  const processedAttributes = splitAttributes(attributes);
  processedAttributes.forEach((i) => {
    const attribute = processedAttributes[i];

    if (Array.isArray(attribute)) {
      // TODO: this still seems wrong.
      ret += attribute.map(a => `[contains(concat(' ', normalize-space(@${i}), ' '), ' ${a} ')]`).join('');
    } else {
      ret += `[@${i}='${attribute}']`;
    }
  });

  return ret;
}

function indexToXPath(index) {
  if (index === null) return '';
  return `[${index}]`;
}

function nodeToXPath(node) {
  const indexString = indexToXPath(node.index);
  const attributeString = attributesToXPath(node.attributes);

  return node.tag + indexString + attributeString;
}

// TODO: wtf is an array obj.
function objectToXPath(nodeArray) {
  if (!nodeArray) return '';

  const result = [];
  for (const i in nodeArray) {
    const node = nodeArray[i];
    result.push(nodeToXPath(node));
  }

  return `/${result.join('/')}`;
}

module.exports = {
  objectToXPath,
  nodeToXPath,
  indexToXPath,
  attributesToXPath,
};
