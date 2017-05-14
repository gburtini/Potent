const expect = require('chai').expect;
const simplify = require('../src/simplify');

describe('simplify', () => {
  it('should take in two XPaths and generate their greatest common subset', () => {
    const simplified = simplify([
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
    ]);

    expect(simplified).to.have.length.of(3);
    expect(simplified[0].tag).to.be.eq('html');
    expect(simplified[0].index).to.be.eq(0);
    expect(simplified[0].attributes).to.be.empty;

    // TODO: this is arguable, in this case I think it should probably be "div|p", but this should be a function of some config.
    expect(simplified[2].tag).to.be.eq('*');
  });
});
