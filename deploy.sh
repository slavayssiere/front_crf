#!/bin/bash

bower install
npm version patch
./node_modules/grunt-cli/bin/grunt build
aws s3 cp build s3://ul-management/ --recursive
git push
