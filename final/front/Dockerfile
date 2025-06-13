# Etapa 1: Build de la app Angular
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

CMD [ "ls" ]

COPY . .
RUN npm run build

# Etapa 2: Imagen de producción con NGINX
FROM nginx:alpine

# Configuración de NGINX para servir la aplicación Angular  
# Copia SOLO el build estático (browser) al directorio de NGINX
COPY --from=build /app/dist/ /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]