import Redis from 'ioredis';

import config from './data-config.js';

async function main() {

  let r = new Redis();

  // delete the existing index, if it's there
  let indices = await r.call('FT._LIST');
  if (indices.includes(config.HASH_INDEX))
    await r.call('FT.DROPINDEX', config.HASH_INDEX);

  // create the index
  await r.call(
    'FT.CREATE', config.HASH_INDEX,
    'ON', 'hash',
    'PREFIX', 1, `${config.HASH_KEY_PREFIX}:`,
    'SCHEMA',
      'id', 'TAG', 'SORTABLE',
      'city', 'TAG', 'SORTABLE',
      'country', 'TAG', 'SORTABLE',
      'description', 'TEXT', 'SORTABLE',
      'location_text', 'TEXT', 'SORTABLE',
      'state', 'TAG', 'SORTABLE',
      'state_abbrev', 'TAG', 'SORTABLE',
      'latitude', 'NUMERIC', 'SORTABLE',
      'longitude', 'NUMERIC', 'SORTABLE',
      'location', 'GEO',
      'city_latitude', 'NUMERIC', 'SORTABLE',
      'city_longitude', 'NUMERIC', 'SORTABLE',
      'city_location', 'GEO',
  )

  // all done
  r.quit();
}

main();