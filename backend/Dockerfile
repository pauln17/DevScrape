FROM ghcr.io/puppeteer/puppeteer:latest

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

WORKDIR /app

COPY package*.json .

RUN npm ci

COPY . .

EXPOSE 3001

CMD ["npm", "run", "start"]