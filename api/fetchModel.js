'use strict';

const { get } = require('axios');

function fetchModel({ brand, year, carline, model }) {
  return get(`http://www.${brand}.com/byo-vc/api/v2/bodystyle/resources/en/US/${brand}/${carline}/${year}/${model}`)
    .then(res => res.data);
}

module.exports = fetchModel;
