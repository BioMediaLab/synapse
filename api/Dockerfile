FROM node:lts-slim as builder_image
COPY . /usr/src
WORKDIR /usr/src
RUN npm install -g yarn && yarn install && yarn run build

FROM node:lts-alpine
WORKDIR /usr/src
COPY --from=builder_image /usr/src .
ENV environment=production

CMD ["node", "/usr/src/dist/src/index.js"]
