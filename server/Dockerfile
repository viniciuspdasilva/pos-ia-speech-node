FROM node:13-alpine

WORKDIR /pos-ia-nodejs

COPY package.json .

RUN yarn

RUN npm install nodemon -g

COPY . .

EXPOSE 3000

CMD nodemon -L --watch . index.js
