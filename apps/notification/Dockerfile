FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm ci

RUN npm run build notification

CMD ["node", "dist/apps/notification/main.js"]
