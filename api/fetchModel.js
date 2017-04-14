'use strict';

const { get } = require('axios');

function normalizeStep({ key, order }) {
  return {
    id: key.toLowerCase(),
    order
  };
}

function normalizeModel({ bodyStyleTitle, processSteps }) {
  return {
    title: bodyStyleTitle,
    steps: processSteps.map(normalizeStep)
  };
}

function fetchModel({ brand, year, carline, model }) {
  return get(`http://www.${brand}.com/byo-vc/api/v2/bodystyle/resources/en/US/${brand}/${carline}/${year}/${model}`)
    .then(res => normalizeModel(res.data));
}

module.exports = fetchModel;
