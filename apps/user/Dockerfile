FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm ci

RUN npx prisma generate

RUN npm run build user

CMD ["node", "dist/apps/user/main.js"]
