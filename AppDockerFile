FROM node:10.16-alpine

WORKDIR /app

# Install bash to execute wait-for-it script
RUN apk update && apk add bash

# Copy app files to app folder
COPY ["package.json", "package-lock.json", "tsconfig.json", "/app/"]

# Make src folder and copy app files files to it
RUN mkdir /app/src
COPY ["./src/", "/app/src/"]

# Install packages and transpile Typescript application
RUN npm install
RUN npm run tsc

# Copy wait-for-it script to scripts folder
RUN mkdir /scripts
COPY ["./docker/wait-for-it.sh", "/scripts"]
