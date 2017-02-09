const http = require('http');
const debug = require('debug')('app');
const app = require('./src');

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(PORT, () => {
  debug('The app is listening on port', PORT);
});
