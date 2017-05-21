const expect = require('chai').expect;
const { simplify } = require('../index');
const potentTools = require('potent-tools');

const XPathQuery = potentTools.types.XPathQuery;
const XPathNode = potentTools.types.XPathNode;


const path = [
  [
    { tag: 'html', attributes: {}, index: 0 },
    { tag: 'body', attributes: {}, index: 0 },
    { tag: 'div', attributes: {}, index: 0 },
  ],
  [
    { tag: 'html', attributes: {}, index: 0 },
    { tag: 'body', attributes: {}, index: 0 },
    { tag: 'p', attributes: {}, index: 0 },
  ],
];
describe('simplify', () => {
  it('should take in two XPaths and generate their greatest common subset', () => {
    const simplified = simplify(path);

    expect(simplified).to.have.length.of(3);
    expect(simplified.nodes[0].tag).to.be.eq('html');
    expect(simplified.nodes[0].index).to.be.eq(0);
    expect(simplified.nodes[0].attributes).to.be.empty;

    // TODO: this is arguable, in this case I think it should probably be "div|p",
    // but this should be a function of some config.
    expect(simplified.nodes[2].tag).to.be.eq('*');
  });

  it('should accept XPathQuery objects', () => {
    const queryObject = path.map((query) => {
      return new XPathQuery(
        query.map(node => new XPathNode(node))
      );
    });

    const simplified = simplify(queryObject);
    expect(simplified).to.have.length.of(3);
    expect(simplified.nodes[0].tag).to.be.eq('html');
  });
});
