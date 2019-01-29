FROM node:lts-slim as builder_image
COPY . /usr/src
WORKDIR /usr/src
RUN npm install --production && npm run build

FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /usr/src
COPY --from=builder_image /usr/src .
EXPOSE 3000
CMD npm run start
