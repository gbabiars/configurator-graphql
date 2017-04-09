'use strict';

const { GraphQLSchema } = require('graphql');

const Query = require('./Query');

const Schema = new GraphQLSchema({
  query: Query
});

module.exports = Schema;
