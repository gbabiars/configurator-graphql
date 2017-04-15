'use strict';

const { buildSchema } = require('graphql');

const Schema = buildSchema(`
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
  msrp: String,
  selected: Boolean,
  conflict: Boolean
}

type DriveType implements CommonOption {
  id: String!
  description: String,
  msrp: String,
  selected: Boolean,
  conflict: Boolean
}

type BodyType implements CommonOption {
  id: String!
  description: String,
  msrp: String,
  selected: Boolean,
  conflict: Boolean,
  cabSize: String,
  showConvertible: Boolean
}

type Trim implements CommonOption {
  id: String!
  description: String,
  msrp: String,
  selected: Boolean,
  conflict: Boolean,
  marketingCopy: String
}

type Option implements CommonOption {
  id: String!
  description: String,
  msrp: String,
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
  msrp: String,
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

type Config {
  ss: String!
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
  ): Config
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
`);

module.exports = Schema;
