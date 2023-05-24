## Description

 The idea is improving the response of this website https://www.geonames.org/ having structured responses and cache when the service is down. 

## Table of Contents

1. [Technology Stack](#Technology-Stack)
1. [Installation](#Installation)
1. [Environment variables](#Environment-variables)
1. [Population data](#Population-data)
1. [Running the app](#Running-the-app)
1. [Test](#Test)
1. [API swagger](#API-swagger)
1. [Project Layout (Brief Explanation)](#Project-Layout-(Brief-Explanation))
1. [Structures DTO examples](#Structures-DTO-examples)
1. [Demo](#Demo)
1. [GeoNames Data quota](#GeoNames-Data-quota)

## Technology Stack
    - nodejs 18.16.0
    - npm 9.5.1
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
  
  ```
  
  FIREBASE_PROJECT_ID=XXXXXXXXX
  FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----XXXXXXXXXXXXXXX -----END PRIVATE KEY-----\n
  FIREBASE_CLIENT_EMAIL=firebase-adminsdk-XXXX@XXXXXX.iam.gserviceaccount.com
  FIREBASE_DATABASE_URL=https://XXXXXXX.firebasedatabase.app/
  CACHE_TTL=15000
  CACHE_HOST=localhost
  CACHE_PORT=6379
  CACHE_USERNAME=default
  CACHE_PASSWORD=XXXXXXXXXXXXXXXXXXXXX
  
  ```

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
 ```
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
│   │   │    ├── fullCountry (Manages the comunication with the Fullcountry Firebase collection)
│   │   │    ├── geonames (Manages the call the GeoNames API using Axios)
│   │   │    ├── province (Manages the call to the province and cities per country)
│   │   │    └── country (Manages the comunication with the country Firebase collection, second layer)
│   │   ├── Intefaces (all interfaces to manage the data which API response in each endpoint, country is the one to map to the entity into the database collection called countries)
│   │   └── DTO (FullCountryDTO to map to the database country-states-city)

│   └── shared (module with shared business logic)
└── test (Contains the end-to-end (e2e) tests)
```

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


## Coverage 

```
---------------------------------|---------|----------|---------|---------|-------------------
File                             | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
---------------------------------|---------|----------|---------|---------|-------------------
All files                        |   54.86 |    13.46 |   48.43 |   54.57 |                   
 src                             |       0 |        0 |       0 |       0 |                   
  app.module.ts                  |       0 |      100 |     100 |       0 | 1-16              
  main.ts                        |       0 |        0 |       0 |       0 | 1-21              
 src/cache-redis                 |   20.83 |        0 |       0 |      15 |                   
  redis.module.ts                |       0 |      100 |       0 |       0 | 1-24              
  redis.service.ts               |   35.71 |        0 |       0 |      25 | 13-31             
 src/database                    |   13.51 |        0 |       0 |    9.09 |                   
  firebase.module.ts             |       0 |        0 |       0 |       0 | 1-33              
  firebase.service.ts            |   19.23 |      100 |       0 |    12.5 | 8-60              
 src/geoNames                    |       0 |      100 |       0 |       0 |                   
  geonames.module.ts             |       0 |      100 |       0 |       0 | 1-38              
 src/geoNames/controllers        |   56.98 |       50 |    62.5 |   56.32 |                   
  dataMigration.controller.ts    |     100 |      100 |     100 |     100 |                   
  geonames.controller.ts         |     100 |      100 |     100 |     100 |                   
  geonamesSnapshot.controller.ts |       0 |        0 |       0 |       0 | 1-119             
 src/geoNames/dto                |   91.66 |      100 |      50 |     100 |                   
  FullCountry.ts                 |   91.66 |      100 |      50 |     100 |                   
 src/geoNames/entities           |   91.89 |      100 |   66.66 |     100 |                   
  CountryResponse.entity.ts      |   83.33 |      100 |      50 |     100 |                   
  ProvinceResponse.entity.ts     |   83.33 |      100 |      50 |     100 |                   
  geoPlace.entity.ts             |   94.11 |      100 |      75 |     100 |                   
  geocountry.entity.ts           |     100 |      100 |     100 |     100 |                   
 src/geoNames/services           |   85.05 |        5 |   76.19 |   84.21 |                   
  country.service.ts             |     100 |      100 |     100 |     100 |                   
  fullCountry.service.ts         |     100 |      100 |     100 |     100 |                   
  geonames.service.ts            |      35 |        0 |       0 |   29.41 | 12-47             
  province.service.ts            |     100 |       50 |     100 |     100 | 19                
  zip.service.ts                 |     100 |      100 |     100 |     100 |                   
 src/interceptors                |   33.33 |        0 |      20 |   31.81 |                   
  logging.interceptor.ts         |      45 |      100 |   33.33 |   38.88 | 19-33             
  noResponse.interceptor.ts      |       0 |        0 |       0 |       0 | 1-13              
 src/logger                      |   70.58 |        0 |   28.57 |   61.53 |                   
  logger.module.ts               |     100 |      100 |     100 |     100 |                   
  logger.service.ts              |   58.33 |        0 |   28.57 |      50 | 27-52             
---------------------------------|---------|----------|---------|---------|-------------------

```
