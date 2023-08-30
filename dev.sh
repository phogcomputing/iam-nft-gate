#!/bin/bash

docker run -u 0 -v $(pwd):/headless/repo \
	--rm --name gateway -it -p 8787:8787 gateway /bin/bash
