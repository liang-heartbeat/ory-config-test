#!/bin/bash

echo "step 1: generate config json file"

echo "step 2: push the json file to ory"

ory update permission-config 143f18ba-304b-40d2-8894-f479b1007961 --file ./src/permission-config.json

rm -- ./src/permission-config.json
