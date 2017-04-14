'use strict';

const { get, post } = require('axios');
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
    ss: config['SERIALIZED-STATE'],
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

function normalizeModelMatrix(modelMatrix) {
  return {
    driveTypes: normalizeDriveTypes(modelMatrix),
    bodyTypes: normalizeBodyTypes(modelMatrix),
    trims: normalizeTrims(modelMatrix),
    engines: normalizeEngines(modelMatrix)
  };
}

function normalizeFullConfig({ config, modelMatrix }) {
  return Object.assign(
    {},
    normalizeConfig(config),
    normalizeModelMatrix(modelMatrix)
  );
}

function fetchConfig(query) {
  const {
    brand,
    year,
    carline,
    model,
    ss,
    styleId,
    axleRatio,
    bodyTypeId,
    driveType,
    engine,
    transmission
  } = query;

  if(ss && styleId) {
    let url = `http://www.${brand}.com/byo-vc/services/retrieveConfiguration/${brand}/US/en/us/${styleId}?bodystyle=${model}&carline=${carline}&modelyear=${year}`;
    return post(url, { ss })
      .then(res => normalizeFullConfig(res.data));
  }
  if(axleRatio && bodyTypeId && driveType && engine && transmission && styleId) {
    let url = `http://www.${brand}.com/byo-vc/services/fullyConfigured/US/en/${brand}/${year}/${carline}/${model}?axleRatio=${axleRatio}&bodyTypeId=${bodyTypeId}&driveType=${driveType}&engine=${engine}&styleId=${styleId}&transmission=${transmission}`;
    return get(url)
      .then(res => normalizeFullConfig(res.data))
  }
  let url = `http://www.${brand}.com/byo-vc/services/fullyConfigured/US/en/${brand}/${year}/${carline}/${model}`;
  return get(url)
    .then(res => normalizeFullConfig(res.data));
}

module.exports = fetchConfig;
