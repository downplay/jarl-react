FROM node:8.11.1-alpine

RUN mkdir -p /app
WORKDIR /app

COPY .babelrc /app/
COPY package.json /app/
COPY yarn.lock /app/

# npm production install is smaller for some reason
RUN npm install --production=true

COPY dist /app/dist
COPY server /app/server

EXPOSE 3210
CMD [ "npm", "run", "start-prod" ]
