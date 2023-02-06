#!/bin/bash

docker run -it -v /var/run/docker.sock:/var/run/docker.sock --rm --name gateway -p 8787:8787 gateway
