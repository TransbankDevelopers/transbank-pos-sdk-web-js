#!/usr/bin/env bash

#Script for create the plugin artifact
echo "Travis tag: $TRAVIS_TAG"

if [ "$TRAVIS_TAG" = "" ]
then
   TRAVIS_TAG='1.0.0'
fi

FILE1="package.json"

sed -i.bkp 's/  "version": "1.0.0",/  "version": "'"${TRAVIS_TAG#"v"}"'",/g' "$FILE1"

npm run build

echo "Plugin version: $TRAVIS_TAG"
