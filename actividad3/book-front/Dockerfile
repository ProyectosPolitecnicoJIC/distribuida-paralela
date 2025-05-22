# Etapa 1: Build de la app Angular
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2: Imagen de producción con NGINX
FROM nginx:alpine

RUN sed -i 's/listen       80;/listen 8080;/' /etc/nginx/conf.d/default.conf

# Copia SOLO el build estático (browser) al directorio de NGINX
COPY --from=build /app/dist/browser /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]