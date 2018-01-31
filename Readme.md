# Candy API

Candy is a simple RESTful API to manage candies. The API is developed using express.js and uses PostgreSQL as a database. The code is written in es6, please test with Node.js v8+. 

I've also deployed the API, so you can test it without installing anything.

API: [candy-app-api.herokuapp.com](https://candy-app-api.herokuapp.com)

Documentation: [candyapi1.docs.apiary.io](https://candyapi1.docs.apiary.io)

Project Structure
```
  |-- api
  |-- bin
  |-- config
  |-- exceptions
  |-- helpers
  |-- middlewares
  |-- sql
  |-- test
  |-- app.js
```

The api is pretty simple, hence the structure of the project. The directory names self-explanatory.

## Getting started

As the project uses PostgreSQL, we need to setup a database. Project comes with a little setup code to help create DB structure and import dummy data.

1. Create a PostgreSQL database and user
2. Edit and configure `config/production.json` accordingly
3. Run `NODE_ENV=production npm run setup -- import` from the project directory


## API

Documentation is available here: [candyapi1.docs.apiary.io](https://candyapi1.docs.apiary.io)

API consists of mutliple endpoints, grouped into two categories.

- candies
- stats

### Root

`GET /`
Returns the version of API.

### Candies Endpoints
`GET /candies`
Returns the list of available candies. Optionally converts price and cost to specified currency.

`GET /candies/:id`
Fetch information about a given candy. Optionally converts cost and price from USD to specified currency.

`POST /candies`
Creates a new candy.

`PUT /candies/:id`
Updates a candy with a given `id`.

`DELETE /candies/:id`
Removes a candy with a given `id`. This endpoint is idempotent.

### Stats Endpoints

`GET /stats/cost`
Returns the cumulative cost of all candies. Optionally does currency conversion if `currency` param is given.

`GET /stats/cost/:id`
Returns the cost of all candies with a given `id`. Optionally does currency conversion if `currency` param is given.

`GET /stats/price`
Returns the cumulative price of all candies. Optionally does currency conversion if `currency` param is given.

`GET /stats/price/:id`
Returns the price of all candies with a given `id`. Optionally does currency conversion if `currency` param is given.

### Possible improvments

1. Cache Currency Rates
Do not fetch the currency rate info for every request that needs conversion. If I were building a real API, I would frequently fetch the currency rates using workers and cache them in Redis or even better in PostgreSQL and do the conversion inside PostgreSQL. As a result response would be much faster and we would not depend on external service too much. We could operate independently (even when they are unreachable)

2. Unit test everything
For the sake of simplicity I didn't implement unit testing for every API call, though I provided a simple example. In real world every endpoint needs a unit testing.
