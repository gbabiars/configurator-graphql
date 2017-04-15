'use strict';

const { post } = require('axios');
const normalizeFullConfig = require('./normalizeFullConfig');

function selectOption(query) {
  const {
    brand,
    year,
    carline,
    model,
    ss,
    styleId,
    input
  } = query;
  const { id } = input;

  const url = `http://www.${brand}.com/byo-vc/services/toggleOptionData/${brand}/US/en/us/${styleId}?bodystyle=${model}&carline=${carline}&modelyear=${year}`;
  return post(url, { ss, rpo: id })
    .then(res => normalizeFullConfig(res.data));
}

module.exports = selectOption;
