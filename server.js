const http = require('http');
const post = process.env.port || 3000;
const app = require('./app');
const server = http.createServer(app);
server.listen(post);