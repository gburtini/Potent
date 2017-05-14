// TODO: these belong in potent-tools as the function that generates these objects is there.
const { isSeparatedAttribute } = require('./helpers');

function attributesToXPath(attributes) {
  let ret = '';
  for (const i in attributes) {
    const attribute = attributes[i];

    const splitter = isSeparatedAttribute(i);
    if (splitter !== false && typeof attribute !== 'string') {
      for (const a in attribute) {
        ret += `[contains(concat(' ', normalize-space(@${i}), ' '), ' ${attribute[a]} ')]`;
      }
    } else {
      ret += `[@${i}='${attribute}']`;
    }
  }
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
function objectToXPath(arrayobj) {
  const result = [];
  for (const i in arrayobj) {
    const node = arrayobj[i];
    result.push(nodeToXPath(node));
  }
  return arrayobj ? `/${result.join('/')}` : '';
}

module.exports = {
  objectToXPath,
  nodeToXPath,
  indexToXPath,
  attributesToXPath,
};
