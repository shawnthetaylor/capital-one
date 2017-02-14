const validators = require('./validators');
const utils = require('./utils');
const calc = require('./calc.js');

// In-memory store of all measurement data
function Store() {
  this.store = {};

  const hasProperties = (parent, child) => {
    const parentProperty = this.store.hasOwnProperty(parent);
    if (child) {
      return parentProperty && this.store[parent].hasOwnProperty(child);
    }
    return parentProperty;
  }

  this.save = (timeStamp, data) => {
    return new Promise((resolve, reject) => {
      const ymd = utils.convertISOToYMD(timeStamp);
      if (!hasProperties(ymd)) {
        this.store[ymd] = {};
      }
      this.store[ymd][timeStamp] = data;
      resolve();
    });
  }

  this.update = (paramTimeStamp, dataTimeStamp, data) => {
    return new Promise((resolve, reject) => {
      if (dataTimeStamp !== paramTimeStamp) {
        reject(409);
      }
      const ymd = utils.convertISOToYMD(paramTimeStamp);
      if (hasProperties(ymd, paramTimeStamp)) {
        this.store[ymd][paramTimeStamp] = data;
        resolve();
      }
      reject(404);
    });
  }

  this.updatePartial = (paramTimeStamp, dataTimeStamp, data) => {
    return new Promise((resolve, reject) => {
      if (dataTimeStamp !== paramTimeStamp) {
        reject(409);
      }
      const ymd = utils.convertISOToYMD(paramTimeStamp);
      if (hasProperties(ymd, paramTimeStamp)) {
        const current = this.store[ymd][paramTimeStamp];
        this.store[ymd][paramTimeStamp] = Object.assign({}, current, data);
        resolve();
      }
      reject(404);
    });
  }

  const getDataRange = (fromDateTime, toDateTime) => {
    const fromDate = utils.convertISOToYMD(fromDateTime);
    const toDate = utils.convertISOToYMD(toDateTime);
    const timeStamps = {};
    Object.keys(this.store).forEach(key => {
      if (key >= fromDate && key <= toDate) {
        Object.assign(timeStamps, this.store[key]);
      }
    });

    const measurements = [];
    Object.keys(timeStamps).forEach(timeStamp => {
      if (timeStamp >= fromDateTime && timeStamp < toDateTime) {
        measurements.push(timeStamps[timeStamp]);
      }
    });
    return measurements;
  }

  const getMetricData = (measurements, metrics) => {
    metrics = typeof metrics === 'object' ? metrics : [metrics];
    const results = {};
    metrics.forEach(metric => {
      results[metric] = [];
    });

    measurements.forEach(measurement => {
      for (const metric of metrics) {
        results[metric].push(measurement[metric]);
      }
    });

    return results;
  }

  function getStatsData(metricData, stats) {
    stats = typeof stats === 'object' ? stats : [stats];
    const output = [];
    Object.keys(metricData).forEach(metric => {
      const data = metricData[metric].filter(value => {
        return value !== undefined;
      });
      if (data.length) {
        stats.forEach(stat => {
          output.push({ metric, stat, value: calc[stat](data) });
        });
      }
    });
    return output;
  }

  this.stats = (stats, metrics, fromDateTime, toDateTime) => {
    const metricData = getMetricData(
      getDataRange(fromDateTime, toDateTime),
      metrics
    )

    const statsData = getStatsData(metricData, stats);
    return new Promise((resolve, reject) => {
      resolve(statsData);
    });
  }

  this.delete = timeStamp => {
    return new Promise((resolve, reject) => {
      const ymd = utils.convertISOToYMD(timeStamp);
      if (hasProperties(ymd, timeStamp)) {
        deleted = delete this.store[ymd][timeStamp];
        if (deleted) {
          resolve();
        }
      }
      reject();
    });
  }

  const findByDate = dateStamp => {
    return new Promise((resolve, reject) => {
      if (dateStamp in this.store) {
        let measurements = [];
        const dateData = this.store[dateStamp];
        for (const utc of Object.keys(dateData)) {
          measurements.push(
            Object.assign(
              {},
              { timestamp: utc },
              dateData[utc]
            )
          );
        }
        if (measurements.length) {
          resolve(measurements);
        }
      }
      reject();
    });
  }

  const findByUTC = timeStamp => {
    return new Promise((resolve, reject) => {
      const ymd = utils.convertISOToYMD(timeStamp);
      if (hasProperties(ymd, timeStamp)) {
        resolve(Object.assign(
          {},
          { timestamp: timeStamp },
          this.store[ymd][timeStamp])
        );
      }
      reject();
    });
  }

  this.find = time => {
    const d = new Date(time);
    if (d.toISOString() === time) {
      return findByUTC(time);
    }
    return findByDate(time);
  }
}

const store = new Store();

module.exports = store;
