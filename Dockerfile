FROM node:18-alpine

WORKDIR /app

# Copiar archivos de configuración primero
COPY package*.json ./
COPY vite.config.ts ./
COPY tsconfig.json ./
COPY tsconfig.app.json ./
COPY tsconfig.node.json ./
COPY index.html ./

# Instalar dependencias
RUN npm install

# Copiar código fuente
COPY . .

# ✅ SOLUCIÓN: No hacer build en desarrollo
# RUN npm run build:force || npm run build || echo "Build completado con advertencias"

EXPOSE 5173

# Comando para desarrollo directo
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]