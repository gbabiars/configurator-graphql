'use strict';

const { flatten } = require('lodash');

function normalizeOption(option) {
  const {
    id,
    displayedMsrp,
    conflict,
    selected,
    description,
    includedInPackage,
    requiresPackage,
    smallImageUrl,
    largeImageUrl
  } = option;
  return {
    id,
    msrp: displayedMsrp,
    conflict,
    selected,
    description,
    includedInPackage,
    requiresPackage,
    smallImageUrl,
    largeImageUrl
  }
}

function normalizeOptionGroups(groups) {
  return Object.keys(groups)
    .map(key => ({
      header: key,
      items: groups[key].map(x => normalizeOption(x))
    }));
}

function normalizePackage(p) {
  const {
    id,
    displayedMsrp,
    conflict,
    selected,
    description,
    includedInPackage,
    requiresPackage,
    smallImageUrl,
    largeImageUrl,
    packageOptions
  } = p;
  return {
    id,
    msrp: displayedMsrp,
    conflict,
    selected,
    description,
    includedInPackage,
    requiresPackage,
    smallImageUrl,
    largeImageUrl,
    options: packageOptions || []
  }
}

function normalizePackageGroups(groups) {
  return Object.keys(groups)
    .map(key => ({
      header: key,
      items: groups[key].map(x => normalizePackage(x))
    }));
}

function normalizeColors(colors) {
  return Object.keys(colors).map(key =>
    ({
      header: key,
      items: flatten(colors[key].map(g => g.items ? g.items : g))
    }));
}

function normalizeConfig(config) {
  return {
    ss: decodeURIComponent(config['SERIALIZED-STATE']),
    msrp: config.VEHICLE.MSRP.totalMSRP,
    interior: normalizeOptionGroups(config.OPTIONS.INTERIOR),
    exterior: normalizeOptionGroups(config.OPTIONS.EXTERIOR),
    accessories: normalizeOptionGroups(config.ACCESSORIES),
    packages: normalizePackageGroups(config.OPTIONS.PACKAGES),
    colors: normalizeColors(config.OPTIONS.COLOR)
  };
}

function normalizeDriveTypes(modelMatrix) {
  return modelMatrix.driveTypes.map(
    ({ id, lowestMSRP, conflict, selected }) => ({ id, msrp: lowestMSRP, conflict, selected })
  );
}

function normalizeBodyTypes(modelMatrix) {
  return modelMatrix.bodyTypes.map(
    ({ id, lowestMSRP, conflict, selected, formattedConfig, cabSize, showConvertible }) =>
      ({ id, msrp: lowestMSRP, conflict, selected, description: formattedConfig, cabSize, showConvertible })
  );
}

function normalizeEngines(modelMatrix) {
  return modelMatrix.engine.map(normalizeOption);
}

function normalizeTrims(modelMatrix) {
  return modelMatrix.styleInformation.map(
    ({ id, totalMSRP, conflict, selected, trimName, marketingCopy }) =>
      ({ id, msrp: totalMSRP, conflict, selected, description: trimName, marketingCopy })
  );
}

function findSelectedId(options) {
  return (options || []).filter(x => x.selected).map(x => x.id)[0];
}

function normalizeModelMatrix(modelMatrix) {
  return {
    driveTypes: normalizeDriveTypes(modelMatrix),
    bodyTypes: normalizeBodyTypes(modelMatrix),
    trims: normalizeTrims(modelMatrix),
    engines: normalizeEngines(modelMatrix),
    driveType: findSelectedId(modelMatrix.driveTypes),
    engine: findSelectedId(modelMatrix.engine),
    bodyType: findSelectedId(modelMatrix.bodyTypes),
    styleId: findSelectedId(modelMatrix.styleInformation),
    transmission: findSelectedId(modelMatrix.transmission),
    axleRatio: findSelectedId(modelMatrix.axleRatio)
  };
}

function normalizeFullConfig({ config, modelMatrix }) {
  return Object.assign(
    {},
    normalizeConfig(config),
    normalizeModelMatrix(modelMatrix)
  );
}

module.exports = normalizeFullConfig;
