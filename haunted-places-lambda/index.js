let { Client } = require('redis-om');
const AWS = require('aws-sdk');

exports.handler = async (event, context) => {
    try {
        let client = new Client();
        await client.open(getEnvironmentVariable('REDIS_CONNECTION'));
        let searchText = BuildSearchText(event);
        let queryResult = await client.execute(['FT.SEARCH' , getEnvironmentVariable('REDIS_SEARCH_INDEX_NAME'), searchText]);
        await client.close();

        let response = buildResponse(queryResult);
        return { statusCode: 200,
            body: JSON.stringify(response)
        };

    }
    catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: {
                errorMessage: err.message
            }
        }
    }
}

const buildResponse = (queryResult) => {
    // The execute gives us a pretty nested set of hashs we can iterate through
    let itemCount = queryResult[0];
    let body = [];
    Object.keys(queryResult).forEach(function (key) {
        if (key > 0)
        {
            var value = queryResult[key];
            Object.keys(value).forEach(function (key2) {
                var innerValue = value[key2];
                if (innerValue.startsWith("{")) {
                    body.push(JSON.parse(innerValue));                    
                }                
            });                        
        }            
    });

    var response = {
        'count': itemCount,
        'hauntedPlaces': body
    };
    
    return response;
}

const BuildSearchText = (event) => {
    // '@location:[-84.5120 39.1031 50 mi]' example
    // Redis is backwards longitude first then latitude    
    return `@location:[${event.queryStringParameters.longitude} ${event.queryStringParameters.latitude} ${event.queryStringParameters.radiusInMiles} mi]`
}

const getEnvironmentVariable = (variableName) => {
    if (!process.env[variableName]) {
        throw new Error(`Environment variable '${variableName}' is missing'`);
    }
    return process.env[variableName];
}
