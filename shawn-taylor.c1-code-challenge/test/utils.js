const expect = require('chai').expect;
const utils = require('../utils');

describe('Utils', () => {
  it('converts ISO date to year-month-day', done => {
    const ymd = utils.convertISOToYMD('2015-12-22T16:00:00.000Z');
    expect(ymd).to.equal('2015-12-22');
    done();
  });

  it('converts ISO date to year-month-day with pad', done => {
    const ymd = utils.convertISOToYMD('2015-09-02T16:00:00.000Z');
    expect(ymd).to.equal('2015-09-02');
    done();
  });

  it('returns timeStamp and data from req.body', done => {
    const { timeStamp, data } = utils.formatData({
      timestamp: '2015-09-02T16:00:00.000Z',
      temperature: 27.1,
      precipitation: 2,
      dewPoint:17.7
    });

    expect(timeStamp).to.equal('2015-09-02T16:00:00.000Z');
    expect(data).to.have.property('temperature');
    expect(data).to.have.property('precipitation');
    expect(data).to.have.property('dewPoint');
    expect(data.temperature).to.equal(27.1);
    expect(data.precipitation).to.equal(2);
    expect(data.dewPoint).to.equal(17.7);
    done();
  });

  it('returns timeStamp and partial data from req.body', done => {
    const { timeStamp, data } = utils.formatData({
      timestamp: '2015-09-02T16:00:00.000Z',
      temperature: 27.1,
    });
    
    expect(timeStamp).to.equal('2015-09-02T16:00:00.000Z');
    expect(data).to.have.property('temperature');
    expect(data.temperature).to.equal(27.1);
    done();
  });
});
