FROM node:6-alpine

RUN mkdir -p /twitter-clone-5

ADD ./package.json /twitter-clone-5/package.json

WORKDIR /twitter-clone-5/
RUN npm install --production -q

ADD ./ /twitter-clone-5

#Comando que inicia
CMD [ "npm", "start" ]
