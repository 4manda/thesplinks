#!/bin/bash

echo "Building js application...";
set -ex

if [ -z "${1}" ]; then
  echo 'Either cordova, browser, or both is required';
  exit 1;
fi;

if [ -z "${2}" ]; then
  echo 'Please provide a version number';
  exit 1;
fi;

if [ "${1}" = "cordova" ]; then
  if [ -d "dist/cordova" ]; then
    rm -r dist/cordova
  fi;
  if [ -d "www" ]; then
    rm -r www
  fi;
  mkdir -p www dist/cordova \
    && cross-env VERSION=${2} APP_NAME=splink NODE_ENV=production WEBPACK_CONFIG=cordova webpack --colors \
    && cp -r dist/cordova/* www/
fi;

if [ "${1}" = "browser" ]; then
  if [ -d "dist/public" ]; then
    rm -r dist/public
  fi;

  mkdir -p dist/public \
    && cross-env VERSION=${2} APP_NAME=splink NODE_ENV=production WEBPACK_CONFIG=static webpack --colors;
  cp -f static/favicon.ico dist/public/;
fi;

if [ "${1}" = "both" ]; then
  if [ -d "dist/cordova" ]; then
    rm -r dist/cordova
  fi;
  if [ -d "www" ]; then
    rm -r www
  fi;
  if [ -d "dist/public" ]; then
    rm -r dist/public
  fi;
  mkdir -p www dist/cordova dist/public \
    && cross-env VERSION=${2} APP_NAME=splink NODE_ENV=production WEBPACK_CONFIG=static webpack --colors \
    && cross-env VERSION=${2} APP_NAME=splink NODE_ENV=production WEBPACK_CONFIG=cordova webpack --colors \
    && cp -r dist/cordova/* www/
  cp -f static/favicon.ico dist/public/;
fi;


set +x;
echo "Done building js application!";
