FROM node:8.11.1-alpine

RUN mkdir -p /app
WORKDIR /app

COPY .babelrc /app/
COPY package.json /app/
COPY yarn.lock /app/
RUN yarn install --production

COPY dist /app/dist
COPY server /app/server

EXPOSE 3210
CMD [ "yarn", "start-prod" ]
