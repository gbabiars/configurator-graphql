'use strict';

const { get } = require('axios');
const _  = require('lodash');

function normalizeFeatures(data) {
  const { groups } = data;
  const styles = Object.keys(data.styleIds).map(id => ({ id, groups: data.styleIds[id] }));

  return Object.keys(groups)
    .map(name => {
      const featureGroup = groups[name];

      return {
        name,
        features: Object.keys(featureGroup).map(id => {
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
        })
      }
    });
}

function fetchFeatures({ brand, year, carline, model }) {
  return get(`http://www.${brand}.com/byo-vc/services/features-specs/comparison/en/US/${brand}/${carline}/${year}/${model}?region=us`)
    .then(res => normalizeFeatures(res.data));
}

module.exports = fetchFeatures;
