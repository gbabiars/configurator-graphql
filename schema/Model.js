'use strict';

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt
} = require('graphql');

function normalizeStep({ key, order }) {
  return {
    id: key.toLowerCase(),
    order
  };
}

const Step = new GraphQLObjectType({
  name: 'Step',
  fields: () => ({
    id: { type: GraphQLString },
    order: { type: GraphQLInt }
  })
});

const Model = new GraphQLObjectType({
  name: 'Model',
  fields: () => ({
    title: {
      type: GraphQLString,
      resolve: ({ bodyStyleTitle }) => bodyStyleTitle
    },
    steps: {
      type: new GraphQLList(Step),
      resolve: ({ processSteps }) => processSteps.map(normalizeStep)
    }
  })
});

module.exports = Model;
