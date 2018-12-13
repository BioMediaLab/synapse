FROM node:lts-slim as builder_image
COPY . /usr/src
WORKDIR /usr/src
RUN npm install -g yarn && yarn install && yarn run build

FROM node:lts-alpine
RUN npm install -g yarn
ENV environemnt=production
WORKDIR /usr/src
COPY --from=builder_image /usr/src .
CMD yarn run start
