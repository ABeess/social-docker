FROM node:lts as dependencies

WORKDIR /src/client
COPY package.json yarn.lock ./
RUN yarn  

FROM node:lts as builder

WORKDIR /src/client
COPY . /src/client
COPY --from=dependencies /src/client/node_modules ./node_modules
RUN yarn build 
