FROM node:latest

WORKDIR /usr/src/app

COPY ./service2.js ./service2.js
COPY ./package.json ./package.json

RUN npm install

CMD ["npm", "run", "service2"]
