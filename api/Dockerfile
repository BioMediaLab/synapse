FROM node:lts-slim as builder_image
COPY . /usr/src
WORKDIR /usr/src
RUN npm install --production && npm run build

FROM node:lts-alpine
WORKDIR /usr/src
COPY --from=builder_image /usr/src .
ENV NODE_ENV=production

CMD ["node", "/usr/src/dist/src/index.js"]
