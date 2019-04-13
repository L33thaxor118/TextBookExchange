FROM node:latest as build-stage

WORKDIR /app

COPY ./nginx.conf /nginx.conf
COPY package*.json /app/
COPY yarn.lock /app/

RUN apt-get update && apt-get install -y apt-transport-https
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get install -y yarn && \
    yarn install

COPY ./ /app/

RUN npm run build

FROM nginx:latest

COPY --from=build-stage /app/build/ /usr/share/nginx/html
COPY --from=build-stage /nginx.conf /etc/nginx/conf.d/default.conf