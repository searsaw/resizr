const express = require('express');
const morgan = require('morgan');

const NODE_ENV = process.env.NODE_ENV || 'development';

const app = express();

app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));

app.get('/', (req, res) => {
  res.send('Hello, world!');
})

module.exports = app;
