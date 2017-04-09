'use strict';

const { get, post } = require('axios');

function getModelUrl({ brand, year, carline, model }) {
  return `http://www.${brand}.com/byo-vc/api/v2/bodystyle/resources/en/US/${brand}/${carline}/${year}/${model}`;
}

function fetchModel(query) {
  const url = getModelUrl(query);
  return get(url).then(res => res.data);
}

function getConfigUrl({ brand, year, carline, model }) {
  return `http://www.${brand}.com/byo-vc/services/fullyConfigured/US/en/${brand}/${year}/${carline}/${model}`;
}

function normalizeConfig(config) {
  return {
    ss: config['SERIALIZED-STATE']
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
  const url = getConfigUrl(query);
  return get(url).then(res => normalizeFullConfig(res.data));
}

module.exports = {
  fetchModel,
  fetchConfig
};
