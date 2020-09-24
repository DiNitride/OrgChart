#!/bin/bash
echo '[MONGO-DB] Starting MongoDB instance'
if [ "$(docker ps -qa -f name=mongo-db)" ];
then
  # Container exists
  # Check if already running
  if [ "$(docker ps -q -f name=mongo-db)" ];
  then
    echo "[MONGO-DB] MongoDB already running"
  else
    docker start mongo-db
    echo "[MONGO-DB] Started MongoDB instance"
  fi
else
  # No container exists
  echo "[MONGO-DB] No MongoDB docker container found. Creating and lauching new one"
  docker run --name mongo-db -d -p 27017:27017 -v ~/mongo-data:/data/db mongo > /dev/null
  echo "[MONGO-DB] Container running on port 27017, volume mounted in ~/mongo-data"
fi

echo "[SYMFONY] Staring Symfony development server"
cd ../api/
pwd
symfony server:start -d --no-tls
echo "[SYMFONY] Development Server started"

echo "[REACT] Starting React App"
