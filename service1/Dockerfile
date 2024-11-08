FROM node:alpine



WORKDIR /usr/src/app

COPY ./service1.js ./service1.js
COPY ./package.json ./package.json


RUN apk add --no-cache docker-cli
RUN apk add --no-cache python3 make g++


RUN npm install

CMD ["npm", "run", "service1"]
