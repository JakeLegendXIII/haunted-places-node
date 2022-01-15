import csv from 'csv-parser';
import Redis from 'ioredis';

import fs from 'fs';

import config from './data-config.js';

let r = new Redis();
let p = r.pipeline();
let idValue = 0;

fs.createReadStream('data/haunted_places.csv')
  .pipe(csv())
  .on('data', data => {
    // the CSV data often has empty string where we want undefined, so call
    // a bunch of functions to give us undefined where we want
    idValue = idValue + 1;
    let id = idValue;
    let city = toTag(data.city);
    let country = toTag(data.country);
    let description = data.description;
    let location = data.location;
    let state = toTag(data.state);
    let state_abbrev = toTag(data.state_abbrev);
    let longitude = toFloat(data.longitude);
    let latitude = toFloat(data.latitude);
    let city_longitude = toFloat(data.city_longitude);
    let city_latitude = toFloat(data.city_latitude);

    // define the Redis key
    let key = `${config.JSON_KEY_PREFIX}:${id}`;

    // create the JSON to store
    let json = JSON.stringify(
      Object.fromEntries(
        Object
          .entries({
            id, city, country, description, location,
            state, state_abbrev, longitude, latitude,
            city_longitude, city_latitude
           })
          .filter(entry => entry[1] !== undefined))); // removes empty values    

    // write the data to Redis
    p.call('JSON.SET', key, '.', json);

  })
  .on('end', () => {
    p.exec()
    r.quit()
  });

function toTitle(value) {
  return value.replace(/^Report \d*: /, '');
}

function toCounty(value) {
  return toTag(value.replace(/ County$/, ''));
}

function toTimestamp(value) {
  return value !== '' ? Math.floor(Date.parse(value) / 1000) : undefined;
}

function toTag(value) {
  return value !== '' ? value : undefined;
}

function toGeo(longitude, latitude) {
  return longitude !== '' && latitude !== '' ? `${toFloat(longitude)},${toFloat(latitude)}` : undefined;
}

function toInteger(value) {
  return value !== '' ? parseInt(value) : undefined;
}

function toFloat(value) {
  return value !== '' ? round(parseFloat(value)) : undefined;
}

function round(num) {
  return +(Math.round(num + 'e+5') + 'e-5');
}