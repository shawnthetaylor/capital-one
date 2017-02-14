const expect = require('chai').expect;
const calc = require('../calc');

describe('Calc Helpers', () => {
  const singleData = [10];
  const data = [27.1, 28.4, 22, 22, 28.1, 26.9];

  it('calculates the min correctly', done => {
    const result = calc.min(data);
    expect(result).to.equal(22);
    const singleResult = calc.min(singleData);
    expect(singleResult).to.equal(10);
    done();
  });

  it('calculates the max correctly', done => {
    const result = calc.max(data);
    expect(result).to.equal(28.4);
    const singleResult = calc.max(singleData);
    expect(singleResult).to.equal(10);
    done();
  });

  it('calculates the average correctly', done => {
    const result = calc.average(data);
    expect(result).to.equal(25.8);
    const singleResult = calc.average(singleData);
    expect(singleResult).to.equal(10);
    done();
  });

  it('calculates the median correctly', done => {
    const result = calc.median(data);
    expect(result).to.equal(26.9);
    const singleResult = calc.median(singleData);
    expect(singleResult).to.equal(10);
    done();
  });
});
