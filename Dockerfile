FROM node:20-alpine

WORKDIR /app

COPY package.json ./

RUN yarn install

COPY . .


RUN yarn build

CMD yarn migration:run && yarn start:prod
