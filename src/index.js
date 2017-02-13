const { resolve } = require('path');
const archiver = require('archiver');
const bodyParser = require('body-parser');
const Busboy = require('busboy');
const debug = require('debug')('app:index');
const express = require('express');
const morgan = require('morgan');
const sharp = require('sharp');

const NODE_ENV = process.env.NODE_ENV || 'development';
const ROOT_DIR = resolve(__dirname, '..');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));
app.set('view engine', 'pug');
app.set('views', resolve(ROOT_DIR, 'templates'));

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/', (req, res) => {
  debug('Posting the image');

  const bb = new Busboy({ headers: req.headers });
  const pipeline = sharp().max();
  const archive = archiver('zip', { zlib: { compression: 9 } });

  bb.on('file', (fieldname, file, filename) => {
    debug('Processing file', filename);

    const [name, ext] = filename.split('.');

    for (let i = 550; i >= 200; i--) { // eslint-disable-line no-plusplus
      archive.append(pipeline.clone().resize(i, i), { name: `${name}_${i}x${i}.${ext}` });
    }

    archive.finalize();

    file.pipe(pipeline);
  });

  const now = new Date();
  const [day, time] = now.toISOString().split('T');
  const archiveName = `${day}-${time}_images.zip`;

  res.attachment(archiveName);
  req.pipe(bb);
  archive.pipe(res);
});

module.exports = app;
