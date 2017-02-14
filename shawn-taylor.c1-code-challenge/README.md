Capital One - Interview
=========
Version: 5 August 2016. v1.2

## General Overview

1. [Routes.js](#routes.js)
2. [Store.js](#store.js)
3. [Calc.js](#calc.js)
4. [Utils.js](#utils.js)
5. [Server.js](#server.js)
6. [Tests](#tests)
7. [Issues](#issues)

## Routes.js
File declaring all routes available on the server.

The majority of this file is fairly straightforward: each route is defined and interacts with the store as necessary. There is one middleware route responsible for validating the data types in POST, PUT, or PATCH requests (located at the top of routes.js).

Each route expects the store to return a Promise. This is totally unnecessary as we're storing all our data in-memory and that has negligible latency. I ultimately decided to build it this way in anticipation of hooking this up to a DB where calls may experience some latency. But again, this project could have just as easily not used Promises and everything would have worked out the same.

## Store.js

This file creates a singleton Store object to be used throughout the app. Because this is an in-memory store, killing the server effectively wipes all the data we had added/manipulated before. By creating a single instance of this object, we can ensure that all calls to `this.store` are referring to the same store.

The store has methods that mimic that of a normal DB api (or closely resemble). Methods like `update` and `partialUpdate` likely can be combined into one with a bit more logic, but I kept them separate for clarity.

## Calc.js

This file contains an object that holds methods to compute simple statistics on arrays of numbers. I only had time to add one extra method `median` but with more time could have implemented others like `mode` or more complex statistical constructs like a sum of squares.

## Utils.js

Another object with some helper methods I found myself writing over and over. These methods simply made the code easier to read at certain parts and separated logic that wasn't necessarily tied to the behavior of the store's methods.

This file also contains the tiny `pad` function because the date formatting required single digit values to prepend a `0`. I'm sure there is a better way of doing this that I'm missing, but that was a quick fix I wrote just to pass unit tests.

## Server.js

Typical NodeJS server.js file. The only part that I'm not very happy about is having to use `minimist` to parse out the flags. It is possible to do this without a third-party library, but the syntax was not very pretty and if more flags are added in the future the file could get really ugly.

Also provided excessive backups for `PORT` and `HOST` in case everything happens to be missing.

## Tests

All unit tests can be found in the `test` directory. The test files are named according to the file they are testing. I'm admittingly not a GREAT TDD follower and wrote about 98% of these after I finished everything else. I  decided to use `expect` in an effort to get myself to enjoy the syntax but ultimately still hate it and will use `assert` from now on.

## Issues

Unfortunately, there are just a few things that I wasn't very happy about with this solution.

1. I feel like my `store` logic got out of hand, I wish I had dedicated more time to refactoring it and making the code more readable.
2. There are no unit tests for `store`.
3. While this project is pretty small and doesn't really need much of a directory structure to make sense, I should have moved things around a bit more to segment them into more distinct directories.

# Thanks!
This was an awesome project to work on and I wish more companies gave interviews like this! Thanks for your time and consideration.
