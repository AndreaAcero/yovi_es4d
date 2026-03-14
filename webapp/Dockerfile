# Build stage
FROM node:22-alpine AS builder
WORKDIR /app

# Install deps
COPY package.json package-lock.json ./
RUN npm ci --silent

# Copy sources
COPY . .

# Accept build-time API url (defaults to localhost:8000) CAMBIADO
ARG VITE_API_URL="http://localhost:8000"
ENV REACT_APP_API_ENDPOINT=$API_URI

RUN export VITE_API_URL=${VITE_API_URL} && npm run build

USER nonroot

# Production image
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]