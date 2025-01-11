# Utilisez une image Node.js comme base
FROM node:18 as builder

# Définissez le répertoire de travail dans l'image
WORKDIR /app

# Copiez les fichiers package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

# Installez les dépendances
RUN npm install

# Copiez tous les fichiers de l'application dans l'image
COPY . .

# Construisez l'application Angular
RUN npm run build --prod

#------------------------------------------------------

# Utilisez une image légère d'nginx pour servir l'application
FROM nginx:alpine

# Copiez les fichiers construits à partir du builder vers le répertoire de travail de Nginx
COPY --from=builder /app/dist/ecom-project-si3-a-front-end/browser /usr/share/nginx/html

# Exposez le port 80 pour le serveur HTTP Nginx
EXPOSE 80


# Commande de démarrage pour Nginx
CMD ["nginx", "-g", "daemon off;"]