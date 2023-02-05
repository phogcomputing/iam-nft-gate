#!/bin/bash

docker run -v $(pwd)/check-video-nft.js:/headless/check-video-nft.js \
	--rm --name gateway -it -p 8787:8787 gateway
