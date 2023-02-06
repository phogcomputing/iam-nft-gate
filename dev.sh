#!/bin/bash

docker run -v $(pwd):/headless/repo \
	--rm --name gateway -it -p 8787:8787 gateway /bin/bash
