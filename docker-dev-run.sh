#!/bin/bash
sudo rm -rf node_modules/
docker build -f Dockerfile.dev -t home-dashboard-react:dev .
#docker run -it -p 3000:3000 -v $(pwd):/app home-dashboard-react:dev
docker run -it -p 3000:3000 home-dashboard-react:dev