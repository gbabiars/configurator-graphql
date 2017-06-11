'use strict';

const { get } = require('axios');

function normalizeCapabilities(data, filterConfigs = [], filterGroups = []) {
  const { groups } = data;
  const configs = Object.keys(data.engineRowData)
    .map(id => ({ id, groups: data.engineRowData[id] }))
    .filter(({ id }) => filterConfigs.length === 0 || filterConfigs.includes(id));

  return Object.keys(groups)
    .filter(name => filterGroups.length === 0 || filterGroups.includes(name))
    .map(name => {
      const specGroup = groups[name];

      const specs = Object.keys(specGroup)
        .map(id => {
          const spec = specGroup[id];

          const values = configs.reduce((hash, config) => {
            hash[config.id] = config.groups[name][id] || '';
            return hash;
          }, {});

          return {
            id,
            description: spec.description,
            values
          };
        });

      return {
        name,
        specs
      };
    });
}

function fetchCapabilities({ brand, year, carline, model, configs, groups }) {
  return get(`http://www.${brand}.com/byo-vc/services/engine-compare/comparison/en/US/${brand}/${carline}/${year}/${model}?region=us`)
    .then(res => normalizeCapabilities(res.data, configs, groups));
}

module.exports = fetchCapabilities;
