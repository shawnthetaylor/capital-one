const express = require('express');
const router = express.Router();
const validators = require('./validators');
const utils = require('./utils');

const store = require('./store');

// Middleware route to ensure data type validation
router.use((req, res, next) => {
  if (req.method.startsWith('P')) { // POST, PUT, PATCH
    const { timeStamp, data } = utils.formatData(req.body);
    if (!validators.DateValidator(timeStamp) || !validators.FloatValidator(data)) {
      res.status(400);
      res.json();
    }
  }
  next();
});

router.route('/measurements')
  .post((req, res) => {
    const { timeStamp, data} = utils.formatData(req.body);

    store.save(timeStamp, data).then(() => {
      res.status(201);
      res.setHeader('Location', `/measurements/${timeStamp}`);
      res.json();
    }).catch(() => {
      res.status(400);
      res.json();
    });
  });

router.route('/measurements/:timestamp')
  .get((req, res) => {
    store.find(req.params.timestamp).then(measurements => {
      res.json(measurements);
    }).catch(() => {
      res.status(404);
      res.json();
    });
  })

  .put((req, res) => {
    const { timeStamp, data } = utils.formatData(req.body);
    const paramTimeStamp = req.params.timestamp;

    store.update(paramTimeStamp, timeStamp, data).then(() => {
      res.status(204);
      res.json();
    }).catch(status => {
      res.status(status);
      res.json();
    });
  })

  .patch((req, res) => {
    const { timeStamp, data } = utils.formatData(req.body);
    const paramTimeStamp = req.params.timestamp;

    store.updatePartial(paramTimeStamp, timeStamp, data).then(() => {
      res.status(204);
      res.json();
    }).catch(status => {
      res.status(status);
      res.json();
    });
  })

  .delete((req, res) => {
    const timeStamp = req.params.timestamp;
    store.delete(timeStamp).then(() => {
      res.status(204);
      res.send('');
    }).catch(() => {
      res.status(404);
      res.send('');
    });
  });

router.route('/stats')
  .get((req, res) => {
    let { stat, metric, fromDateTime, toDateTime } = req.query;
    store.stats(stat, metric, fromDateTime, toDateTime).then(stats => {
      res.status(200);
      res.json(stats);
    });
  });

module.exports = router;
