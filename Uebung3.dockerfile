FROM node:14-alpine
WORKDIR /home/node/app

ENV WAIT_VERSION 2.7.3
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/$WAIT_VERSION/wait /wait
RUN chmod +x /wait

RUN chown -R node:node /home/node/app
COPY package*.json ./
USER node
RUN npm install
COPY --chown=node:node uebung3.js uebung3.js

CMD /wait && node uebung3.js