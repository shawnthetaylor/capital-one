const expect = require('chai').expect;
const { DateValidator, FloatValidator }= require('../validators');

describe('DateValidator', () => {
  const validDates = ['2015-09-02T16:00:00.000Z', '2015-09-01', 123141];
  const invalidDates = ['2015-09-02T16:00:00:000Z', '2015-909-01'];

  it('detects valid dates', done => {
    validDates.forEach(date => {
      const isValid = DateValidator(date);
      expect(isValid).to.be.true;
    });
    done();
  });

  it('detects invalid dates', done => {
    invalidDates.forEach(date => {
      const isValid = DateValidator(date);
      expect(isValid).to.be.false;
    });
    done();
  });
});

describe('FloatValidator', () => {
  const validFloats = [5, 3.2252353, 9.0, .9, 8.];
  const validFloatObject = [2.1, 5, 7.422, 1., .09];
  const invalidFloats = ['not a number', [], {}, '23', '53.2'];
  const invalidFloatObject = ['23', 5, 7.422, 1., .09];

  it('detects valid floats', done => {
    validFloats.forEach(value => {
      const isValid = FloatValidator(value);
      expect(isValid).to.be.true;
    });
    done();
  });

  it('detects invalid floats', done => {
    invalidFloats.forEach(value => {
      const isValid = FloatValidator(value);
      expect(isValid).to.be.false;
    });
    done();
  });

  it('detects valid float object', done => {
    const isValid = FloatValidator(validFloatObject);
    expect(isValid).to.be.true;
    done();
  });

  it('detects invalid float object', done => {
    const isValid = FloatValidator(invalidFloatObject);
    expect(isValid).to.be.false;
    done();
  });
});
