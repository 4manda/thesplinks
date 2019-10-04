# WedApp Frontend
React/Redux wedding application to provide information to guests and to collect and track RSVPs:
* Authentication to wedding info and RSVP via a secret code provided to guests
* Single page web-application with parallax scrolling experience and responsive design compatbile on iOS, Android, and modern web browsers
* Integration with PostgreSQL backend to store guest lists, rsvps, event details, and more
* Administrative login and UI components for tracking RSVPs and updating event details

## Frontend Technologies
* Webpack
* React
* React-router
* Redux
* Cordova
* ES6
* Sass

## TODO (because of the short, one-week time frame of this project, linting and testing has not been updated / maintained)
* Testing (using Eslint, Mocha, Chai, Enzyme, Sinon, nightwatch, ...)

## Requirements
* node.js
* For running nightwatch/selenium, JDK 7 ([**Nightwatch docs**](http://nightwatchjs.org/gettingstarted#selenium-server-setup))
* For building Cordova for different platforms, check [**the Cordova documenation**](https://cordova.apache.org/docs/en/latest/guide/cli/index.html#install-pre-requisites-for-building)

## Getting started
* Clone the repo
* ```npm install```
* ```npm install -g cordova```
* ```cordova platform add %PLATFORM%``` (android and more)

## Usage
* For development
  * ```npm run start``` - starts a dev server on 'localhost:8090'

* For linting/testing (because of the short, one-week time frame of this project, linting and testing has not been updated / maintained)
  * ```npm run lint``` - eslint
  * ```npm run test``` - runs mocha unit testing
  * ```npm run e2e``` - runs nightwatch e2e tests

* For building
  * ```npm run build-static``` - creates a static build of ui in dist/public
  * ```npm run static``` - runs the static build in dist/public

* Running as mobile application
  * ```cordova emulate android``` or other cordova build or run command ([**Cordova docs**](https://cordova.apache.org/docs/en/latest/reference/cordova-cli/index.html#cordova-build-command))
