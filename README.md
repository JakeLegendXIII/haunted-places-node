# haunted-places-node
  A simple app created for utilizing Redis and RediSearch to find Haunted Places.
  
  Heavily inspired by [Guy Royse's finding-bigfoot talk](https://github.com/guyroyse/finding) and utilizes Tim Renner's data set on [Haunted Locations](https://data.world/timothyrenner/haunted-places).

  The end-goal is to have a functioning web api and potentially an app that allows you to find nearby Haunted Places in the US based off geolocation and other parameters.

## Getting started guide
If you happen to find this and want to give it a try you can get it running on your machine locally by using the following steps.

### Redis Setup

You can use docker desktop to run an instance of Redis locally. Included in the /docker route of this application is a docker-compose.yml that can set this up for you. For more info Guy has a good write up on this [here](https://github.com/guyroyse/finding-bigfoot/blob/main/code/docker/README.md).

Once you have docker ready you can run this command to launch Redis (with RediSearch and ReJSON):
```
$ docker compose up
```
### Load the Data

From the root of the application (or via scripts in the package.json) you can run some node scripts to populate the Redis database. You can use either the hash or Json scripts or both.

Json:
```
$ node load-json.js
```
Hash:
```
$ node load-hash.js
```
Probably the best way to checkout your database is to use [RedisInsight](https://redis.com/redis-enterprise/redis-insight/) or you could use the CLI. 

### Setup the Indices
To leverage all the power of RediSearch we need to add indices (indexes?) to our data set. There are scripts included to accomplish that in the root of this project as well. Same deal as before you can run them.

Json:
```
$ node create-indices-json.js
```
Hash:
```
$ node create-indices.js
```
Now we can search for our data using more than just the key value. This can be accomplished via RedisInsight or the CLI.

### Haunted Places Queries
In this app we really only utilize the index on the location property that is setup as a GEO element or Geo Tag. But you can play around with queries on all the properties listed in the index files.

When running the queries in the RediSearch tab in RedisInsight you just need to copy the "@location..." part from below. The rest is populated for you when you pick your index. If you're using the CLI you can copy the whole command.

Finding all the Haunted Places within 50 miles of Cincinnati OH:

Json:
```
FT.SEARCH "hauntedplaces:location:json:index" "@location:[-84.5120 39.1031 50 mi]"
```
Hash:
```
FT.SEARCH "hauntedplaces:location:index" "@location:[-84.5120 39.1031 50 mi]"
```
Pretty cool! To learn way more in a more entertaining way you can check out the [slides from Guy's bigfoot talk](https://github.com/guyroyse/finding-bigfoot/blob/main/slides/Finding%20Bigfoot%20with%20Redis%20%2B%20RediSearch.pdf) to learn more about how to use RediSearch or checkout their offical documentation.

### Run the Included Lambda
I have built a Lambda and an API gateway in AWS that I use to hit this data in a cloud instance of Redis. If you're interested in running it locally you can navigate to the /haunted-places-lambda directory and run the test-runner.js.

```
$ node test-runner.js
```
If you want to change the test data you can change the query parameters in the test-runner.js file:

``` JavaScript
queryStringParameters: { radiusInMiles: '20', latitude: '39.1031', longitude: '-84.5120' }
 ```

