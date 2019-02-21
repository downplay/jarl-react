# Entrypoint when running inside docker only!

cd /app
yarn
yarn bootstrap
yarn build
cd demo
yarn start
