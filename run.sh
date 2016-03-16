#!/bin/bash

mongod --dbpath=./data --port=27018 &
nodemon app.js 5001 &
