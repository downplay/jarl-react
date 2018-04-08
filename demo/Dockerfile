FROM node:8.11.1-alpine

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app/
COPY yarn.lock /app/
RUN yarn install

COPY . /app

EXPOSE 3210
CMD [ "yarn", "start" ]