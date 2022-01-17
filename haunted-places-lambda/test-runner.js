require('dotenv').config();

const entry = require('./index');

// This lambda is triggered via an API Gateway proxy and passes an event
entry.handler(
    {
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
    }
, {}).then(response => console.log(`Lambda response: ${JSON.stringify(response)}`));