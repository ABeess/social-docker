FROM node:lts-alpine

WORKDIR /usr/src/graphql


COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY . .

COPY .env.production .env

RUN yarn build

COPY weighty-droplet-357309-d67e3ea0b5f4.json /src/server/dist/utils/

ENV NODE_ENV production

EXPOSE 3089
EXPOSE 3098
EXPOSE 1935
CMD [ "yarn", "start" ]
USER node