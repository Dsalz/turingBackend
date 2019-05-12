# Spree

[![codecov](https://codecov.io/gh/Dsalz/turingBackend/branch/develop/graph/badge.svg?token=BdOumjFaKT)](https://codecov.io/gh/Dsalz/turingBackend) [![Build Status](https://travis-ci.com/Dsalz/turingBackend.svg?token=qNmHgqwZcXDPqxv9epgB&branch=develop)](https://travis-ci.com/Dsalz/turingBackend)

## Table of Contents

* [About](#about)
* [Getting Started](#gettingstarted)
* [Documentation](#documentation)
* [Testing](#testing)
* [Dependencies](#dependencies)

## About

Backend API for shopping website

## Getting Started

### Online

* API is hosted on heroku at https://spreee-backend.herokuapp.com/api/v1

### Locally

* NB: A lot of env variables are required to get the project to run and commiting them would be highly unsafe so i've included the env file in the zip file sent on the turing platform. You will need to set the NODE_ENV variable to production so the project knows to connect to the hosted sql server or create one locally and modify the localConnection configuration object in ./server/database/config.js with the server's configuration

* Run ```npm install``` to install dependencies

* Run ```npm run build``` to transpile server files into a folder called dist

* Run ```npm start``` to start the server and listen to port 3000

* API is now being served at http://localhost:3000/api/v1/

## Documentation

* Provided documentation https://backendapi.turing.com/docs/ was followed exactly in the creation of this project

* Architecture employed is the MVC (Mode view controller) architecture which is where the data and the presentation logic are kept separate and connected by the controller.

* Authentication is done using the bearer scheme and api key is passed in the request header under 'USER_KEY'

* API utilizes SQL procedures for the most part when querying the database to avoid SQL injections

* User input is thoroughly sanitized before getting to the controllers

* Reusable code like queries and error codes are defined in one file and exported to where needed to keep the code D.R.Y and so that subsequent changes will only need to be made in only that one file

* Travis CI was used for continuous integration and CodeCov for code coverage reporting

* All functions and methods were adequately doccumented

## Testing

* I hope you appreciate the effort i put into writing the tests for this project

* Run ```npm test`` to run test suite

* NB: reminder that the env variables are needed for the test suite to run. The test suite will only run once if you use the hosted database connection because in the test suite for customer sign up you'll be signing up a user and it's supposed to return a status 200 the first time but subsequent calls will return a status of 400 because the user's email will already be registered in the database from the first run.

## Dependencies

* Express - MVC Node framework used

* JsonWebToken - For generating access tokens

* Babel - for transpiling ES6 code down to ES5 in production

* Eslint - for code linting

* Mocha - for testing

* Body-Parser - for parsing http requests

* MySql - For communicating with the database

* Passport - For social media authentication

* Stripe - For payment integration

* Cors - For cross origin resource sharing

* SendGrid - For sending emails