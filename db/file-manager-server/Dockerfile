FROM node:16

WORKDIR /app
COPY package*.json /app/

RUN npm install

COPY . /app/

RUN npm run build
ENTRYPOINT [ "npm", "run", "start" ]
