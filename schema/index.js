'use strict';

const { makeExecutableSchema } = require('graphql-tools');
const GraphQLJSON = require('graphql-type-json');

const schemaString = `
scalar JSON

type Step {
  id: String,
  order: Int
}

type Model {
  title: String,
  steps: [Step]
}

interface CommonOption {
  id: String!
  description: String,
  msrp: Int,
  selected: Boolean,
  conflict: Boolean
}

type DriveType implements CommonOption {
  id: String!
  description: String,
  msrp: Int,
  selected: Boolean,
  conflict: Boolean
}

type BodyType implements CommonOption {
  id: String!
  description: String,
  msrp: Int,
  selected: Boolean,
  conflict: Boolean,
  cabSize: String,
  showConvertible: Boolean
}

type Trim implements CommonOption {
  id: String!
  description: String,
  msrp: Int,
  selected: Boolean,
  conflict: Boolean,
  marketingCopy: String
}

type Option implements CommonOption {
  id: String!
  description: String,
  msrp: Int,
  selected: Boolean,
  conflict: Boolean,
  includedInPackage: Boolean,
  requiresPackage: Boolean,
  smallImageUrl: String,
  largeImageUrl: String
}

type OptionGroup {
  header: String,
  items: [Option]
}

type PackageOption {
  id: String!,
  description: String,
  smallImageUrl: String,
  largeImageUrl: String
}

type Package implements CommonOption {
  id: String!
  description: String,
  msrp: Int,
  selected: Boolean,
  conflict: Boolean,
  smallImageUrl: String,
  largeImageUrl: String,
  options: [PackageOption]
}

type PackageGroup {
  header: String,
  items: [Package]
}

type MSRP {
  base: Int,
  total: Int,
  destinationPrice: Int,
  packageDiscountTotal: Int,
  accessoriesTotal: Int,
  optionsTotal: Int,
  vehicleAndOptionsTotal: Int
}

type Config {
  ss: String!,
  msrp: MSRP!,
  transmission: String!,
  axleRatio: String,
  engine: String!,
  driveType: String!,
  bodyType: String,
  styleId: String!,
  driveTypes: [DriveType],
  bodyTypes: [BodyType],
  trims: [Trim],
  engines: [Option],
  interior: [OptionGroup],
  exterior: [OptionGroup],
  accessories: [OptionGroup],
  colors: [OptionGroup],
  packages: [PackageGroup]
}

type Feature {
  id: String!,
  description: String!,
  hasDetails: Boolean,
  disclaimer: String,
  imageUrl: String,
  longDescription: String,
  shortDescription: String,
  values: JSON
}

type FeatureGroup {
  name: String!,
  features: [Feature]
}

type Spec {
  id: String!,
  description: String,
  values: JSON
}

type SpecGroup {
  name: String!,
  specs: [Spec]
}

type Query {
  model(brand: String!, year: Int!, carline: String!, model: String!): Model,
  config(
    brand: String!, 
    year: Int!, 
    carline: String!, 
    model: String!, 
    ss: String, 
    styleId: String, 
    bodyTypeId: String,
    driveType: String,
    engine: String,
    axleRatio: String,
    transmission: String
  ): Config,
  features(
    brand: String!, 
    year: Int!, 
    carline: String!, 
    model: String!, 
    styleIds: [String], 
    groups: [String]
  ): [FeatureGroup],
  specs(
    brand: String!, 
    year: Int!, 
    carline: String!, 
    model: String!, 
    configs: [String]
    groups: [String]
  ): [SpecGroup]  
}

input OptionSelection {
  id: String!
}

type Mutation {
  selectOption(
    brand: String!, 
    year: Int!, 
    carline: String!, 
    model: String!, 
    ss: String, 
    styleId: String, 
    input: OptionSelection
  ): Config
}

schema {
  query: Query,
  mutation: Mutation
}
`;

const resolveFunctions = {
  JSON: GraphQLJSON
};
const Schema = makeExecutableSchema({ typeDefs: schemaString, resolvers: resolveFunctions });

module.exports = Schema;
