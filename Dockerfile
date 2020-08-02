FROM node:10.16-alpine

WORKDIR /app

# Install bash to execute wait-for-it script
RUN apk update && apk add bash

# Copy app files to app folder
COPY [".", "/app/"]

# Install packages and transpile Typescript application
RUN npm install
RUN npm run tsc
