# Étape 1 : Construction
FROM node:20-alpine AS build

# On récupère l'argument de build défini dans GitHub Action
ARG VITE_API_BASE_URL
# On le transforme en variable d'environnement pour que Vite le voit
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Vite va maintenant "brûler" la valeur "/api" dans le code
RUN npm run build

# Étape 2 : Nginx
FROM nginx:stable-alpine
# On nettoie le dossier par défaut de nginx
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]