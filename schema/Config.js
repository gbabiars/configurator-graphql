'use strict';

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLBoolean
} = require('graphql');

function withCommonFields(fields) {
  const commonFields = {
    id: { type: GraphQLString },
    description: { type: GraphQLString },
    msrp: { type: GraphQLString },
    selected: { type: GraphQLBoolean },
    conflict: { type: GraphQLBoolean }
  };
  return Object.assign(commonFields, fields);
}

const DriveType = new GraphQLObjectType({
  name: 'DriveType',
  fields: () => withCommonFields({})
});

const BodyType = new GraphQLObjectType({
  name: 'BodyType',
  fields: () => withCommonFields({
    cabSize: { type: GraphQLString },
    showConvertible: { type: GraphQLBoolean }
  })
});

const Trim = new GraphQLObjectType({
  name: 'Trim',
  fields: () => withCommonFields({
    marketingCopy: { type: GraphQLString }
  })
});

const Option = new GraphQLObjectType({
  name: 'Option',
  fields: () => withCommonFields({
    includedInPackage: { type: GraphQLBoolean },
    requiresPackage: { type: GraphQLBoolean },
    smallImageUrl: { type: GraphQLString },
    largeImageUrl: { type: GraphQLString }
  })
});

const OptionGroup = new GraphQLObjectType({
  name: 'OptionGroup',
  fields: () => ({
    header: { type: GraphQLString },
    items: { type: new GraphQLList(Option) }
  })
});

const Config = new GraphQLObjectType({
  name: 'Config',
  fields: () => ({
    ss: { type: GraphQLString },
    driveTypes: { type: new GraphQLList(DriveType) },
    bodyTypes: { type: new GraphQLList(BodyType) },
    trims: { type: new GraphQLList(Trim) },
    engines: { type: new GraphQLList(Option) },
    interior: { type: new GraphQLList(OptionGroup) },
    exterior: { type: new GraphQLList(OptionGroup) },
    accessories: { type: new GraphQLList(OptionGroup) }
  })
});

module.exports = Config;
