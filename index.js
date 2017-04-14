'use strict';

const express = require('express');
const graphqlHTTP = require('express-graphql');

const { fetchModel, fetchConfig } = require('./api');
const Schema = require('./schema');

const app = express();

const root = {
  model: (query) => fetchModel(query),
  config: (query) => fetchConfig(query)
};

app.use('/graphql', graphqlHTTP({
  schema: Schema,
  rootValue: root,
  graphiql: true
}));

app.listen(4000);
