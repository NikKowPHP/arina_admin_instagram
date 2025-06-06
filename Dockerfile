FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY nest-app/dist ./dist
COPY nest-app/prisma ./prisma

RUN npx prisma generate

EXPOSE 3000

CMD ["node", "dist/main"]