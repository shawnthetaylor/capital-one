const express = require('express');
const bodyParser = require('body-parser');
const minimist = require('minimist');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const commandLineArgs = minimist(process.argv.slice(2));

const port = commandLineArgs.port || process.env.PORT || 3000;
const host = commandLineArgs.host || process.env.HOST || 'localhost';

app.use(require('./routes'));

app.listen(port, host);
// console.log(`Running on port ${port}, host ${host}`);

module.exports = app;
