'use strict';

const { get, post } = require('axios');

function getModelUrl({ brand, year, carline, model }) {
  return `http://www.${brand}.com/byo-vc/api/v2/bodystyle/resources/en/US/${brand}/${carline}/${year}/${model}`;
}

function fetchModel(query) {
  const url = getModelUrl(query);
  return get(url).then(res => res.data);
}

module.exports = {
  fetchModel
};
