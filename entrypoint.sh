# Entrypoint when running inside docker only!

cd /app
npm install
npm run build
cd demo
npm run start
