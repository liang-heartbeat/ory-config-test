#!/bin/bash

bash <(curl https://raw.githubusercontent.com/ory/meta/master/install.sh) -b . ory

sudo mv ./ory /usr/local/bin/
