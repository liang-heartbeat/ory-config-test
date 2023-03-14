#!/bin/bash

curl https://raw.githubusercontent.com/ory/meta/master/install.sh | sh -s ory

sudo mv ./bin/ory /usr/local/bin/
