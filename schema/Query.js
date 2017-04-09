'use strict';

const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString
} = require('graphql');

const Model = require('./Model');

const {fetchModel} = require('../api');

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    model: {
      type: Model,
      args: {
        brand: { type: GraphQLString },
        year: { type: GraphQLInt },
        carline: { type: GraphQLString },
        model: { type: GraphQLString }
      },
      resolve: (data, query) => fetchModel(query)
    },
  })
});

module.exports = Query;
