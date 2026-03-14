FROM node:18-alpine

WORKDIR /app/game

# Copiar package files
COPY package*.json ./

# Instalar dependencias
RUN npm install --production

# Copiar código
COPY .dockerignore ./
COPY gameModel.js ./
COPY game-service.js ./
COPY gameService.test.js ./

# Exponer puerto
EXPOSE 8003

USER nonroot

ARG API_ORIN_URI:="http://localhost:5173"
ENV REACT_APP_API_ORIGIN_ENDPOINT=$API_ORIGIN_URI

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8003/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Comando de inicio
CMD ["npm", "start"]
