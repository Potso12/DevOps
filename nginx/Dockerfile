FROM nginx:stable-alpine

RUN apk add --no-cache apache2-utils

RUN htpasswd -bc /etc/nginx/.htpasswd otsot password

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8198

CMD ["nginx", "-g", "daemon off;"]