require('dotenv').config();

const entry = require('./index');

entry.handler(
    {
        resource: '/hauntedplaces',
        path: '/hauntedplaces',
        httpMethod: 'GET',
        queryStringParameters: { radiusInMiles: '125', latitude: '39.1031', longitude: '-84.5120' },
        multiValueQueryStringParameters: {
          radiusInMiles: [ '50' ],
          latitude: [ '39.1031' ],
          longitude: [ '-84.5120' ]
        },
        pathParameters: null,      
        body: null,
        isBase64Encoded: false
      }
, {}).then(response => console.log(`Lambda response: ${JSON.stringify(response)}`));