FROM node:10-alpine

RUN mkdir -p /home/node/app && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY ./ ./

USER node
RUN yarn install
CMD ["yarn", "run", "prod"]
