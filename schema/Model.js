'use strict';

const {
  GraphQLObjectType,
  GraphQLString
} = require('graphql');

const Model = new GraphQLObjectType({
  name: 'Model',
  fields: () => ({
    title: {
      type: GraphQLString,
      resolve: ({ bodyStyleTitle }) => bodyStyleTitle
    }
  })
});

module.exports = Model;
