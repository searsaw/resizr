const express = require('express');
const morgan = require('morgan');
const { resolve } = require('path');
const sharp = require('sharp');

const NODE_ENV = process.env.NODE_ENV || 'development';
const IMAGES_DIR = resolve(__dirname, '..', 'images');

const app = express();

app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));

app.get('/:file', (req, res) => {
  const { file } = req.params;
  const [filename, ext] = file.split('.');

  sharp(`${IMAGES_DIR}/${file}`)
    .resize(100, 100)
    .max()
    .toFile(`${IMAGES_DIR}/${filename}_smaller.${ext}`)
    .then(() => {
      res.send('Done mothafucka');
    });
});

module.exports = app;
