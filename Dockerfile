# Stage 1
FROM node:lts as build-step
RUN mkdir /app
WORKDIR /app
COPY . /app
RUN npm install
RUN npm install react-scripts@4.0.1 -g
RUN npm run build

# Stage 2
FROM nginx:alpine
COPY --from=build-step /app/build /usr/share/nginx/html
