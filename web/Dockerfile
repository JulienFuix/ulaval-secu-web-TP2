FROM node:16-alpine

WORKDIR /web

COPY package.json package.json

RUN npm i

EXPOSE 3000

CMD npm run start