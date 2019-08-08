const express = require('express');

const db = require('./data/dbConfig.js');

const server = express();

server.use(express.json());

const AccountRouter = require('./accounts/account-router.js');

server.use('/api/accounts', AccountRouter);

server.get('/', (req, res) => {
  res.send('<h3>DB Helpers with knex</h3>');
});

module.exports = server;