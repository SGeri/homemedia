FROM node:16

COPY package*.json ./

RUN npm install

COPY . .