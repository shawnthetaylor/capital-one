const expect = require('chai').expect;
const request = require('request');
const server = require('../server');

const PORT = 8000;
const HOST = `http://localhost:${PORT}`;

describe('Weather Server', () => {
  before(() => {
    server.listen(PORT);
  });

  const validData = {
    timestamp: '2015-09-01T16:00:00.000Z',
    temperature: 27.1,
    dewPoint: 16.7,
    precipitation: 0
  };

  const invalidData = {
    timestamp: '2015-09-01T16:00:00.000Z',
    temperature: 'not a number',
    dewPoint: 16.7,
    precipitation: 0
  }

  const dataArray = [
    { timestamp: '2015-09-01T16:00:00.000Z', temperature: 27.1, dewPoint: 16.7, precipitation: 0 },
    { timestamp: '2015-09-01T16:10:00.000Z', temperature: 27.3, dewPoint: 16.9, precipitation: 0 },
    { timestamp: '2015-09-01T16:20:00.000Z', temperature: 27.5, dewPoint: 17.1, precipitation: 0 },
    { timestamp: '2015-09-01T16:30:00.000Z', temperature: 27.7, dewPoint: 17.3, precipitation: 0 },
    { timestamp: '2015-09-01T16:40:00.000Z', temperature: 27.9, dewPoint: 17.5, precipitation: 0 },
    { timestamp: '2015-09-02T16:00:00.000Z', temperature: 28.1, dewPoint: 17.7, precipitation: 0 }
  ];

  const statsArray = [
    { timestamp: '2015-09-01T16:00:00.000Z', temperature: 27.1, dewPoint: 16.9 },
    { timestamp: '2015-09-01T16:10:00.000Z', temperature: 27.3 },
    { timestamp: '2015-09-01T16:20:00.000Z', temperature: 27.5, dewPoint: 17.1 },
    { timestamp: '2015-09-01T16:30:00.000Z', temperature: 27.4, dewPoint: 17.3 },
    { timestamp: '2015-09-01T16:40:00.000Z', temperature: 27.2 },
    { timestamp: '2015-09-01T17:00:00.000Z', temperature: 28.1, dewPoint: 18.3 }
  ];

  describe('POST to /measurements', () => {

    const base = {
      url: `${HOST}/measurements`,
      json: true
    };

    it('should add a measurement with valid data', done => {
      const data = Object.assign({}, base, { body: validData });
      request.post(data, (err, res, body) => {
        expect(res.statusCode).to.equal(201);
        expect(res).to.be.json;
        done();
      });
    });

    it('should not add a measurement with invalid data types', done => {
      const data = Object.assign({}, base, { body: invalidData });
      request.post(data, (err, res, body) => {
        expect(res.statusCode).to.equal(400);
        expect(res).to.be.json;
        done();
      });
    });

    it('should not add a measurement without a timestamp', done => {
      const data = Object.assign({}, base, {
        temperature: 27.1,
        dewPoint: 16.7,
        precipitation: 0
      });
      request.post(data, (err, res, body) => {
        expect(res.statusCode).to.equal(400);
        expect(res).to.be.json;
        done();
      });
    });
  });

  describe('GET to /measurements/:timestamp', () => {
    const base = { json: true };
    const URL = `${HOST}/measurements`;

    before(() => {
      dataArray.forEach(data => {
        const options = Object.assign({}, base, { url: `${HOST}/measurements`, body: data });
        request.post(options);
      });
    });

    it('should return a measurement at a specific timestamp', done => {
      const options = Object.assign({}, base, { url: `${URL}/2015-09-01T16:00:00.000Z` });
      request.get(options, (err, res, body) => {
        expect(res.statusCode).to.equal(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('Object');
        expect(res.body).to.have.property('timestamp');
        expect(res.body).to.have.property('temperature');
        expect(res.body).to.have.property('dewPoint');
        expect(res.body).to.have.property('precipitation');
        expect(res.body.timestamp).to.equal('2015-09-01T16:00:00.000Z');
        expect(res.body.temperature).to.equal(27.1);
        expect(res.body.dewPoint).to.equal(16.7);
        expect(res.body.precipitation).to.equal(0);
        done();
      });
    });

    it('should not return a measurement that does not exist', done => {
      const options = Object.assign({}, base, { url: `${URL}/2015-09-15T16:00:00.000Z` });
      request.get(options, (err, res, body) => {
        expect(res.statusCode).to.equal(404);
        expect(res).to.be.json;
        done();
      });
    });

    it('should return array of measurements on a specific date', done => {
      const options = Object.assign({}, base, { url: `${URL}/2015-09-01` });
      request.get(options, (err, res, body) => {
        expect(res.statusCode).to.equal(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('Array');
        expect(res.body.length).to.be.equal(5);
        done();
      });
    });

    it('should not return measurements on a date with no measurements', done => {
      const options = Object.assign({}, base, { url: `${URL}/2015-09-15` });
      request.get(options, (err, res, body) => {
        expect(res.statusCode).to.equal(404);
        expect(res).to.be.json;
        done();
      });
    });
  });

  describe('PUT to /measurements/:timestamp', () => {
    const base = { json: true };
    const URL = `${HOST}/measurements`;

    before(() => {
      dataArray.forEach(data => {
        const options = Object.assign({}, base, { url: `${HOST}/measurements`, body: data });
        request.post(options);
      });
    });

    it('should replace a measurement with valid (numeric) values', done => {
      const options = Object.assign({}, base, {
        url: `${URL}/2015-09-01T16:00:00.000Z`,
        body: {
          timestamp: '2015-09-01T16:00:00.000Z',
          temperature: 27.1,
          dewPoint: 16.7,
          precipitation: 15.2
        }
      });
      request.put(options, (err, res, body) => {
        expect(res.statusCode).to.equal(204);
        expect(res).to.be.json;
        done();
      });
    });

    it('should not replace a measurement with invalid values', done => {
      const options = Object.assign({}, base, {
        url: `${URL}/2015-09-01T16:00:00.000Z`,
        body: {
          timestamp: '2015-09-01T16:00:00.000Z',
          temperature: 'not a number',
          dewPoint: 16.7,
          precipitation: 15.2
        }
      });
      request.put(options, (err, res, body) => {
        expect(res.statusCode).to.equal(400);
        expect(res).to.be.json;
        done();
      });
    });

    it('should not replace a measurement with mismatched timestamps', done => {
      const options = Object.assign({}, base, {
        url: `${URL}/2015-09-01T16:00:00.000Z`,
        body: {
          timestamp: '2015-09-02T16:00:00.000Z',
          temperature: 27.1,
          dewPoint: 16.7,
          precipitation: 15.2
        }
      });
      request.put(options, (err, res, body) => {
        expect(res.statusCode).to.equal(409);
        expect(res).to.be.json;
        done();
      });
    });

    it('should not replace a measurement that does not exist', done => {
      const options = Object.assign({}, base, {
        url: `${URL}/2015-09-15T16:00:00.000Z`,
        body: {
          timestamp: '2015-09-15T16:00:00.000Z',
          temperature: 27.1,
          dewPoint: 16.7,
          precipitation: 15.2
        }
      });
      request.put(options, (err, res, body) => {
        expect(res.statusCode).to.equal(404);
        expect(res).to.be.json;
        done();
      });
    });
  });

  describe('PATCH to /measurements/:timestamp', () => {
    const base = { json: true };
    const URL = `${HOST}/measurements`;

    before(() => {
      dataArray.forEach(data => {
        const options = Object.assign({}, base, { url: `${HOST}/measurements`, body: data });
        request.post(options);
      });
    });

    it('should updates metrics of a measurement with valid (numeric) values', done => {
      const options = Object.assign({}, base, {
        url: `${URL}/2015-09-01T16:00:00.000Z`,
        body: {
          timestamp: '2015-09-01T16:00:00.000Z',
          precipitation: 12.3
        }
      });
      request.patch(options, (err, res, body) => {
        expect(res.statusCode).to.equal(204);
        expect(res).to.be.json;
        done();
      });
    });

    it('should not update metrics of a measurement with invalid values', done => {
      const options = Object.assign({}, base, {
        url: `${URL}/2015-09-01T16:00:00.000Z`,
        body: {
          timestamp: '2015-09-01T16:00:00.000Z',
          precipitation: 'not a number'
        }
      });
      request.patch(options, (err, res, body) => {
        expect(res.statusCode).to.equal(400);
        expect(res).to.be.json;
        done();
      });
    });

    it('should not update metrics of a measurement with mismatched timestamps', done => {
      const options = Object.assign({}, base, {
        url: `${URL}/2015-09-01T16:00:00.000Z`,
        body: {
          timestamp: '2015-09-15T16:00:00.000Z',
          precipitation: 12.3
        }
      });
      request.patch(options, (err, res, body) => {
        expect(res.statusCode).to.equal(409);
        expect(res).to.be.json;
        done();
      });
    });

    it('should not update metrics of a measurement that does not exist', done => {
      const options = Object.assign({}, base, {
        url: `${URL}/2015-09-15T16:00:00.000Z`,
        body: {
          timestamp: '2015-09-15T16:00:00.000Z',
          precipitation: 12.3
        }
      });
      request.patch(options, (err, res, body) => {
        expect(res.statusCode).to.equal(404);
        expect(res).to.be.json;
        done();
      });
    });
  });

  describe('DELETE to /measurements/:timestamp', () => {
    const base = { json: true };
    const URL = `${HOST}/measurements`;

    before(() => {
      dataArray.forEach(data => {
        const options = Object.assign({}, base, { url: `${HOST}/measurements`, body: data });
        request.post(options);
      });
    });

    it('should delete a specific measurement', done => {
      const options = Object.assign({}, base, { url: `${URL}/2015-09-01T16:00:00.000Z` });
      request.delete(options, (err, res, body) => {
        expect(res.statusCode).to.equal(204);
        expect(res).to.be.json;
        done();
      });
    });

    it('should not delete a measurement that does not exist', done => {
      const options = Object.assign({}, base, { url: `${URL}/2015-09-15T16:00:00.000Z` });
      request.delete(options, (err, res, body) => {
        expect(res.statusCode).to.equal(404);
        expect(res).to.be.json;
        done();
      });
    });
  });

  describe('GET to /stats?<params>', () => {
    const base = { json: true };
    const URL = `${HOST}/stats`;

    function generateQueryString(params, extraQuery) {
      let query = Object.keys(params)
        .map(q => `${encodeURIComponent(q)}=${encodeURIComponent(params[q])}`)
        .join('&');
      // awkward workaround for duplicate query params
      return query + extraQuery;
    }

    before(() => {
      statsArray.forEach(data => {
        const options = Object.assign({}, base, { url: `${HOST}/measurements`, body: data });
        request.post(options);
      });
    });

    it('should get stats for a well-reported metric', done => {
      const params = {
        stat: 'min',
        metric: 'temperature',
        fromDateTime: '2015-09-01T16:00:00.000Z',
        toDateTime: '2015-09-01T17:00:00.000Z'
      };
      const query = generateQueryString(params, '&stat=max&stat=average');
      const options = Object.assign({}, base, { url: `${URL}?${query}` });
      request.get(options, (err, res, body) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.a('Array');
        expect(res.body.length).to.equal(3);
        expect(res.body[0]).to.have.property('metric');
        expect(res.body[0]).to.have.property('stat');
        expect(res.body[0]).to.have.property('value');
      });
      done();
    });

    it('should get stats for a sparsely-reported metric', done => {
      const params = {
        stat: 'min',
        metric: 'dewPoint',
        fromDateTime: '2015-09-01T16:00:00.000Z',
        toDateTime: '2015-09-01T17:00:00.000Z'
      };
      const query = generateQueryString(params, '&stat=max&stat=average');
      const options = Object.assign({}, base, { url: `${URL}?${query}` });
      request.get(options, (err, res, body) => {

        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.a('Array');
        expect(res.body.length).to.equal(3);
        expect(res.body[0]).to.have.property('metric');
        expect(res.body[0]).to.have.property('stat');
        expect(res.body[0]).to.have.property('value');
      });
      done();
    });

    it('should get stats for a metric that has never been reported', done => {
      const params = {
        stat: 'min',
        metric: 'precipitation',
        fromDateTime: '2015-09-01T16:00:00.000Z',
        toDateTime: '2015-09-01T17:00:00.000Z'
      };
      const query = generateQueryString(params, '&stat=max&stat=average');
      const options = Object.assign({}, base, { url: `${URL}?${query}` });
      request.get(options, (err, res, body) => {

        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.a('Array');
        expect(res.body.length).to.equal(0);
      });
      done();
    });

    it('should get stats for more than one metric', done => {
      const params = {
        stat: 'min',
        metric: 'precipitation',
        fromDateTime: '2015-09-01T16:00:00.000Z',
        toDateTime: '2015-09-01T17:00:00.000Z'
      };
      const query = generateQueryString(params, '&metric=temperature&metric=dewPoint&stat=max&stat=average');
      const options = Object.assign({}, base, { url: `${URL}?${query}` });
      request.get(options, (err, res, body) => {

        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.a('Array');
        expect(res.body.length).to.equal(6);
        expect(res.body[0]).to.have.property('metric');
        expect(res.body[0]).to.have.property('stat');
        expect(res.body[0]).to.have.property('value');
      });
      done();
    });
  });
});
