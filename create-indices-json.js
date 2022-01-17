import Redis from 'ioredis';

import config from './data-config.js';

async function main() {

  let r = new Redis();

  // delete the existing index, if it's there
  let indices = await r.call('FT._LIST')
  if (indices.includes(config.JSON_INDEX))
    await r.call('FT.DROPINDEX', config.JSON_INDEX);

  // create the index
  await r.call(
    'FT.CREATE', config.JSON_INDEX,
    'ON', 'json',
    'PREFIX', 1, `${config.JSON_KEY_PREFIX}:`,
    'SCHEMA',
      '$.id', 'AS', 'id', 'NUMERIC',
      '$.city', 'AS', 'city', 'TAG',
      '$.country', 'AS', 'country', 'TAG',
      '$.description', 'AS', 'description', 'TEXT', 'SORTABLE',
      '$.location_text', 'AS', 'location_text', 'TEXT', 'SORTABLE',
      '$.state', 'AS', 'state', 'TAG',
      '$.state_abbrev', 'AS', 'state_abbrev', 'TAG',
      '$.latitude', 'AS', 'latitude', 'NUMERIC', 'SORTABLE',
      '$.longitude', 'AS', 'longitude', 'NUMERIC', 'SORTABLE',
      '$.location', 'AS', 'location', 'GEO',
      '$.city_latitude', 'AS', 'city_latitude', 'NUMERIC', 'SORTABLE',
      '$.city_longitude', 'AS', 'city_longitude', 'NUMERIC', 'SORTABLE',
      '$.city_location', 'AS', 'city_location', 'GEO'     
  );
  
  // all done
  r.quit();
}

main();