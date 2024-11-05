FROM nginx:stable-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8200

CMD ["nginx", "-g", "daemon off;"]