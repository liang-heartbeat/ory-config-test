#!/bin/bash

ory update permission-config 143f18ba-304b-40d2-8894-f479b1007961 --file ../../src/permission-config.json

rm -- ./src/permission-config.json
