FROM node:lts as build-step

RUN mkdir /app
WORKDIR /app
COPY . /app
RUN npm install

RUN npm run build

# Stage 2
FROM nginx:alpine
COPY --from=build-step /app/dist /usr/share/nginx/html
