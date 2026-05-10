# ---------- Build stage ----------
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci --silent --legacy-peer-deps

COPY . .
RUN npm run build


# ---------- Production stage ----------
FROM nginx:stable-alpine

# Install curl (for healthcheck)
RUN apk add --no-cache curl

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy full build output
COPY --from=build /app/dist /usr/share/nginx/html

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -fs http://localhost/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
