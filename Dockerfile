FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY dist ./dist
COPY prisma ./prisma

RUN npx prisma generate

EXPOSE 3000

CMD ["node", "dist/main"]