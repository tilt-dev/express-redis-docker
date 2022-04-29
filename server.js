const express = require('express');
const morgan  = require('morgan');
const app = express();

app.use(morgan('combined'));

const redisClient = require('./redis-client');

app.get('/store/:key', async (req, res) => {
  const { key } = req.params;
  const value = req.query;
  await redisClient.setAsync(key, JSON.stringify(value));
  return res.send('Success');
});

app.get('/:key', async (req, res) => {
  const { key } = req.params;
  const rawData = await redisClient.getAsync(key);
  return res.json(JSON.parse(rawData));
});

app.get('/', (req, res) => {
  return res.send('Hello world');
});

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'default'
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT} - ${NODE_ENV}`);
});
