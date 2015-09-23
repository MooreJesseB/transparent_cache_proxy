var express = require('express');

var app = express();

app.use(require('../app/router/router'));

module.exports = app;