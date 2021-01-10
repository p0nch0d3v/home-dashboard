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
ARG REACT_APP_OPENWEATHERMAP_API_KEY
ENV REACT_APP_OPENWEATHERMAP_API_KEY $REACT_APP_OPENWEATHERMAP_API_KEY
ARG OPENWEATHERMAP_API_KEY
ENV OPENWEATHERMAP_API_KEY $OPENWEATHERMAP_API_KEY
COPY --from=build-step /app/build /usr/share/nginx/html
