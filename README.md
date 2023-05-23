## Description

 The idea is improving the response of this website https://www.geonames.org/ having structured responses and cache when the service is down. 

## Technology Stack
    - nodejs
    - npm 
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
 
 ## Project Layout (Brief Explanation)
 
 .
├── .env (Make sure to create this file locally and fill the env vars)
├── data (data for pre-populate)
├── src
│   ├── main.ts (This entry point is used for local server)
│   ├── database (Module implementation of Firebase realtime)
│   │   ├── Firebase.service (service to talk to the DB, it could be act like a repository)
│   ├── cache-redis (Module implementation of redis)
│   │   ├── redis.service (service to talk to the cache store)
│   ├── geonames (module)
│   │   ├── controllers
│   │   │    ├── dataMigrationController (main responsability is saving the API geonames in firebase calling the fullCountryService)
│   │   │    └── geoNamesController (main responsability is interact to the services to get the data from the cache or falling that, the database, it calls ProvinceService amd CountryService)
│   │   ├── services 
│   │   │    ├── fullCountry (controls the fullCountry entity which is the DTO saved in the db, calls Firebase.service)
│   │   │    ├── geonames (Manages the call the GeoNames API using Axios)
│   │   │    ├── province (Manages the call to the province and cities per country)
│   │   │    └── country (Manages the comunication with the country Firebase repository, second layer)
│   │   ├── Intefaces (all interfaces to manage the data which API response in each endpoint)
│   │   ├── DTO (FullCountryDTO to map to the database country-states-city)
│   │   └── DTO (FullCountryDTO to map to the database country-states-city)

│   └── shared (module with shared business logic)
└── test (Contains the end-to-end (e2e) tests)


 ## Structures DTO examples 
   FullCountryDTO example ::::
   
   ```
   "FullCountries": {
    "AR": {
      "geonameId": 3865483,
      "iso": "AR",
      "name": "Argentina",
      "provinces": [
        {
           "geonameId": 3435907,
           "lat": "-36",
           "lng": "-60",
           "toponymName": "Buenos Aires"
          "cities": [
            {
              "geonameId": 3854937,
              "lat": "-38",
              "lng": "-60.25",
              "toponymName": "Partido de Adolfo González Chaves"
            },
            {
              "geonameId": 3436394,
              "lat": "-34.83333",
              "lng": "-58.33333",
              "toponymName": "Partido de Almirante Brown"
            },
            .........
           ]
        }
      ..........
     ]
    }
```
 
 
 
 ## Demo 
 

 

## GeoNames Data quota 

free : GeoNames data is free, the data is available without costs.
cc-by licence (creative commons attributions license). You should give credit to GeoNames when using data or web services with a link or another reference to GeoNames.
commercial usage is allowed
'as is' : The data is provided "as is" without warranty or any representation of accuracy, timeliness or completeness.
20'000 credits daily limit per application (identified by the parameter 'username'), the hourly limit is 1000 credits. A credit is a web service request hit for most services. An exception is thrown when the limit is exceeded.
