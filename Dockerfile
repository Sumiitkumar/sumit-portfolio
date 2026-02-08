# Simple Dockerfile for the portfolio app
FROM node:20-alpine as build
WORKDIR /app
COPY sumit-portfolio/package*.json ./
RUN npm ci
COPY sumit-portfolio ./
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
