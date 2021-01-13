const express = require('express');
const server = express();

const postsRouter = require('../api/posts/posts-router');

server.use(express.json());

server.use('/api/posts', postsRouter);

// OTHER ENDPOINTS:
server.get('/', (req, res) => {
  res.send(`<h2>See The Posts</h2>`);
});

module.exports = server