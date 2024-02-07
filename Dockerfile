FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install phantomjs-prebuilt

COPY . .

CMD [ "npm", "run", "build" ]
CMD [ "npm", "run", "start" ]
