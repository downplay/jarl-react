FROM node:22-alpine

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app/

RUN npm install --omit=dev

COPY dist /app/dist
COPY server /app/server

EXPOSE 3210
CMD [ "npm", "run", "start-prod" ]
