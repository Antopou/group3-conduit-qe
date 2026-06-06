FROM node:lts-alpine

ENV HOST=0.0.0.0
ENV PORT=3000

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npx prisma generate
RUN npx nx build api

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/api/main.js"]
