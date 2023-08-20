import 'dotenv/config';

import { handler } from './index.js';

const event = {
    resource: '/hauntedplaces',
    path: '/hauntedplaces',
    httpMethod: 'GET',
    queryStringParameters: { radiusInMiles: '20', latitude: '39.1031', longitude: '-84.5120' },
    multiValueQueryStringParameters: {
      radiusInMiles: [ '20' ],
      latitude: [ '39.1031' ],
      longitude: [ '-84.5120' ]
    },
    pathParameters: null,      
    body: null,
    isBase64Encoded: false
};

handler(event, {}).then(response => console.log(`Lambda response: ${JSON.stringify(response)}`));
