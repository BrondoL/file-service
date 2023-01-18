FROM node:lts-alpine3.16
WORKDIR /app/

COPY package.json ./
COPY package-lock.json ./
RUN npm i

COPY . ./

RUN chmod +x start.sh

EXPOSE 8080

CMD ["sh", "start.sh"]