## Description

 The idea is improving the response of this website https://www.geonames.org/ having structured responses and cache when the service is down. 

## Technology Stack
    - Typescript 4.9.5
    - Nestjs 9.4.2
    - Firebase/RealTime Database 
    - Redis 6.0.16

## Installation

```bash
$ npm install
```

## Environment variables 

  update these variables as you need
  
  FIREBASE_PROJECT_ID=XXXXXXXXX
  FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----XXXXXXXXXXXXXXX -----END PRIVATE KEY-----\n
  FIREBASE_CLIENT_EMAIL=firebase-adminsdk-XXXX@XXXXXX.iam.gserviceaccount.com
  FIREBASE_DATABASE_URL=https://XXXXXXX.firebasedatabase.app/
  CACHE_TTL=15000
  CACHE_HOST=localhost
  CACHE_PORT=6379

## Population data

 There is a file countries-db-populated.json under data folder to populate the countries collection with all the countries in the  world
 
 example :: 
 ```
 {
  .....
    {
      "name": "Argentina",
      "iso": "AR",
      "geonameId": 3865483
    },
    {
      "name": "American Samoa",
      "iso": "AS",
      "geonameId": 5880801
    },
    {
      "name": "Austria",
      "iso": "AT",
      "geonameId": 2782113
    },
    ........
 }
 ```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## API swagger

 host/api --> to take a look at the swagger doc API. 
 
 ## Functionality 
 
 Under populateFullCountry controller you update your database with the countries what you need and it will create the collection called FullCountries with all the states/provinces per country and its corresponding cities. 
 
 Under GeoPlaces controller you will discover endpoints to get all countries or an spacific country. To do that you need first to have the country in the database. So will need to run for example 
 First populate into the DB the country you need
  ```
  curl -X 'GET' \
   http://localhost:4000/populateFullCountry/provinces/AR/cities' \
  -H 'accept: applation/json'
 ```
then you will be able to get a result 
 
 ```
  curl -X 'GET' \
  'http://localhost:4000/geonames/provinces/AR/cities' \
  -H 'accept: applation/json'
 ```
 the first time you call the methods under GeoPlaces controller, it will save the result into the cache. so next time you need it, it will be back from the cache. 
 
 
 
 ## Structures DTO examples 
 
 
 
 

 

