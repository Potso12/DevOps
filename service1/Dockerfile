FROM node:18



WORKDIR /usr/src/app

COPY ./service1.js ./service1.js
COPY ./package.json ./package.json


RUN npm install

CMD ["npm", "run", "service1"]
