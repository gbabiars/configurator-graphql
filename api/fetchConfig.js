'use strict';

const { get, post } = require('axios');
const normalizeFullConfig = require('./normalizeFullConfig');

function fetchConfig(query) {
  const {
    brand,
    year,
    carline,
    model,
    ss,
    msrp,
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
