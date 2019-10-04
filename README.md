# WedApp
## Features
* Webpack
* React
* React-router
* Redux
* Cordova
* ES6
* Sass

## TODO
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

* For linting/testing
  * ```npm run lint``` - eslint
  * ```npm run test``` - runs mocha unit testing
  * ```npm run e2e``` - runs nightwatch e2e tests

* For building
  * ```npm run build-static``` - creates a static build of ui in dist/public
  * ```npm run static``` - runs the static build in dist/public

* Running as mobile application
  * ```cordova emulate android``` or other cordova build or run command ([**Cordova docs**](https://cordova.apache.org/docs/en/latest/reference/cordova-cli/index.html#cordova-build-command))

## Editing code
Make changes to the files in the src/ directory
The apps icon is res/rings.png, and is specified in the config.xml as ```<icon />```
