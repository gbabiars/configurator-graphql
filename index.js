'use strict';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express');

const { fetchModel, fetchConfig, selectOption } = require('./api');
const Schema = require('./schema');

const app = express();

app.use(cors());

const root = {
  model: (query) => fetchModel(query),
  config: (query) => fetchConfig(query),
  selectOption: (query) => selectOption(query)
};

app.use('/graphql', bodyParser.json(), graphqlExpress({
  schema: Schema,
  rootValue: root,
  graphiql: true
}));

app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
}));

app.listen(4000);
