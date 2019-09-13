FROM node:10-alpine AS build
WORKDIR /usr/src/zkrapp
COPY package.json yarn.lock .yarnclean ./
RUN apk add --update \
&& apk add --no-cache ca-certificates \
&& apk add --no-cache --virtual .build-deps git curl build-base python g++ make \
&& yarn install --ignore-engines \
&& apk del .build-deps

FROM node:10-alpine
LABEL name "zkrapp"
LABEL version "0.9.0"
LABEL maintainer "Abady <gamersspeaks@gmail.com>"
WORKDIR /usr/src/zkrapp
COPY --from=build /usr/src/zkrapp .
COPY . .
RUN yarn temp-build \
&& yarn temp-views
ENV NODE_ENV= \
	consumer_key= \
	consumer_secret= \
	access_token= \
	access_secret= \
	callback= \
	session_secret= \
	DB= \
	CHECK_RATE= \
	DAILY_RATE= \
	OWNER_ID=
CMD ["node", "dist/zkr.js"]