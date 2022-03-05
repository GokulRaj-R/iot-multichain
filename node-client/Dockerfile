FROM node:17-alpine3.14

RUN mkdir -p /home/node/app && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY ./ ./

USER node
RUN yarn install
CMD ["yarn", "run", "prod"]
