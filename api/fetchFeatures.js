'use strict';

const { get } = require('axios');

function normalizeFeatures(data, filterStyleIds = [], filterGroups = []) {
  const { groups } = data;
  const styles = Object.keys(data.styleIds)
    .map(id => ({ id, groups: data.styleIds[id] }))
    .filter(({ id }) => filterStyleIds.length === 0 || filterStyleIds.includes(id));

  return Object.keys(groups)
    .filter(name => !filterGroups || filterGroups.includes(name))
    .map(name => {
      const featureGroup = groups[name];

      const features = Object.keys(featureGroup)
        .map(id => {
          const feature = featureGroup[id];
          const {
            description,
            details: hasDetails,
            disclaimer,
            imageUrl,
            longDescription,
            shortDescription
          } = feature;

          const values = styles.reduce((hash, style) => {
            hash[style.id] = style.groups[name][id] || '';
            return hash;
          }, {});

          return {
            id,
            description,
            hasDetails,
            disclaimer,
            imageUrl,
            longDescription,
            shortDescription,
            values
          };
        });

      return {
        name,
        features
      };
    });
}

function fetchFeatures({ brand, year, carline, model, styleIds, groups }) {
  return get(`http://www.${brand}.com/byo-vc/services/features-specs/comparison/en/US/${brand}/${carline}/${year}/${model}?region=us`)
    .then(res => normalizeFeatures(res.data, styleIds, groups));
}

module.exports = fetchFeatures;
