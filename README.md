## Description

 The idea is improving the response of this website https://www.geonames.org/ having better structured responses, reducing times hitting to get the same data. Using Redis to cache the responses in case the DB or the api are down and finally I implemented a snapshot services to get a zip with the data to be consumed for others microservices in order to save it in its own disk, avoiding API resilience or Kafka latency.    

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
    - reacjs 18.0.2
    - react-scripts 5.0.1
    - axios 1.4.0 
    - Typescript 4.9.5
    - Nestjs 9.4.2
    - Firebase/RealTime Database 
    - Redis 6.0.16

## Installation

```bash
$ npm install
```

## Environment variables 

  update these variables as you need, you are able to get them from https://app.redislabs.com/ and  https://console.firebase.google.com/ 
  
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
│   │   │    ├── dataMigrationController (main responsability is saving the external API geonames in firebase calling the fullCountryService)
│   │   │    ├── geoNamesSnapshotController (same as geoNamesController but returning the data within an snapshot or zip to save it in the callee microservice's host)
│   │   │    └── geoNamesController (main responsability is interact to the services to get the data from the cache or falling that, the database, it calls ProvinceService amd CountryService)
│   │   ├── services 
│   │   │    ├── fullCountry (Manages the comunication with the Fullcountry Firebase collection called FullCountry, country, states, cities)
│   │   │    ├── geonames (Manages the call the GeoNames API using Axios)
│   │   │    ├── province (Manages the call to the province and cities per country)
│   │   │    ├── zip (Manages the same functionality than country and fullCountry but returning an snapshot of the data)
│   │   │    └── country (Manages the comunication with the country Firebase collection called Country, second layer)
│   │   │
│   │   ├── entities (Contains all the entities to manage the DAO and DTO objects) 
│   │   ├── Intefaces (Manage the behaviour of objects when it is called geonames external API)
│   │   └── DTO (FullCountryDTO to map to the database country-states-city)
│   │ 
│   ├── interceptors (interceptos to manage logging and empty responses)   
│   └── logger (module and logger service)
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
 
 [Here](https://geonames-snapshots-glnahupqx-jetchegaray.vercel.app/swagger#/)
 

## GeoNames Data quota 

free : GeoNames data is free, the data is available without costs.
cc-by licence (creative commons attributions license). You should give credit to GeoNames when using data or web services with a link or another reference to GeoNames.
commercial usage is allowed
'as is' : The data is provided "as is" without warranty or any representation of accuracy, timeliness or completeness.
20'000 credits daily limit per application (identified by the parameter 'username'), the hourly limit is 1000 credits. A credit is a web service request hit for most services. An exception is thrown when the limit is exceeded.


## Coverage 

It is missing some testing .. collaboration always will be well received

```----------------------------------|---------|----------|---------|---------|-------------------
File                              | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
----------------------------------|---------|----------|---------|---------|-------------------
All files                         |   59.53 |    18.51 |   56.92 |   59.06 |                   
 src                              |       0 |        0 |       0 |       0 |                   
  app.module.ts                   |       0 |      100 |     100 |       0 | 1-16              
  main.ts                         |       0 |        0 |       0 |       0 | 1-36              
 src/cache-redis                  |   20.83 |        0 |       0 |      15 |                   
  redis.module.ts                 |       0 |      100 |       0 |       0 | 1-26              
  redis.service.ts                |   35.71 |        0 |       0 |      25 | 13-31             
 src/database                     |   13.51 |        0 |       0 |    9.09 |                   
  firebase.module.ts              |       0 |        0 |       0 |       0 | 1-33              
  firebase.service.ts             |   19.23 |      100 |       0 |    12.5 | 8-60              
 src/geoNames                     |       0 |      100 |       0 |       0 |                   
  geonames.module.ts              |       0 |      100 |       0 |       0 | 1-37              
 src/geoNames/controllers         |      55 |    42.85 |    62.5 |   54.25 |                   
  data-migration.controller.ts    |     100 |      100 |     100 |     100 |                   
  geonames-snapshot.controller.ts |       0 |        0 |       0 |       0 | 1-129             
  geonames.controller.ts          |   97.29 |    85.71 |     100 |   97.14 | 72                
 src/geoNames/dto                 |   91.66 |      100 |      50 |     100 |                   
  Fullcountry.ts                  |   91.66 |      100 |      50 |     100 |                   
 src/geoNames/entities            |   91.89 |      100 |   66.66 |     100 |                   
  country-response.entity.ts      |   83.33 |      100 |      50 |     100 |                   
  geocountry.entity.ts            |     100 |      100 |     100 |     100 |                   
  geoplace.entity.ts              |   94.11 |      100 |      75 |     100 |                   
  province-response.entity.ts     |   83.33 |      100 |      50 |     100 |                   
 src/geoNames/services            |   84.26 |     4.76 |   76.19 |   83.33 |                   
  country.service.ts              |     100 |      100 |     100 |     100 |                   
  fullcountry.service.ts          |   94.44 |        0 |     100 |   93.75 | 30                
  geonames.service.ts             |      35 |        0 |       0 |   29.41 | 11-46             
  province.service.ts             |     100 |       50 |     100 |     100 | 19                
  zip.service.ts                  |     100 |      100 |     100 |     100 |                   
 src/interceptors                 |     100 |      100 |     100 |     100 |                   
  logging.interceptor.ts          |     100 |      100 |     100 |     100 |                   
  no-response.interceptor.ts      |     100 |      100 |     100 |     100 |                   
 src/logger                       |   76.47 |       20 |   42.85 |   69.23 |                   
  logger.module.ts                |     100 |      100 |     100 |     100 |                   
  logger.service.ts               |   66.66 |       20 |   42.85 |      60 | 33-52             
----------------------------------|---------|----------|---------|---------|-------------------

```
