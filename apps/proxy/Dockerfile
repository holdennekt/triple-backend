FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build -- proxy

EXPOSE 3000

CMD ["node", "dist/apps/proxy/main"]
