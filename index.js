'use strict';

const express = require('express');
const cors = require('cors');
const graphqlHTTP = require('express-graphql');

const { fetchModel, fetchConfig, selectOption } = require('./api');
const Schema = require('./schema');

const app = express();

app.use(cors());

const root = {
  model: (query) => fetchModel(query),
  config: (query) => fetchConfig(query),
  selectOption: (query) => selectOption(query)
};

app.use('/graphql', graphqlHTTP({
  schema: Schema,
  rootValue: root,
  graphiql: true
}));

app.listen(4000);
