FROM nginx:alpine

ENV NODE_ENV=production

WORKDIR /www

COPY default.conf /etc/nginx/conf.d
COPY dist .
