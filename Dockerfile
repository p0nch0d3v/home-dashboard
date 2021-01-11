FROM node:lts as build-step
RUN mkdir /app
WORKDIR /app
COPY . /app
RUN npm install
RUN npm install react-scripts@4.0.1 -g
RUN npm run build

ARG REACT_APP_OPENWEATHERMAP_API_KEY
ENV REACT_APP_OPENWEATHERMAP_API_KEY $REACT_APP_OPENWEATHERMAP_API_KEY

# Stage 2
FROM nginx:alpine
COPY --from=build-step /app/build /usr/share/nginx/html

# FROM ubuntu:latest
# RUN apt update -y && apt upgrade -y
# RUN apt install nginx curl -y
# RUN cd /tmp
# RUN curl -sL https://deb.nodesource.com/setup_14.x -o nodesource_setup.sh
# RUN bash nodesource_setup.sh
# RUN apt install nodejs

# RUN mkdir /app
# WORKDIR /app
# COPY . /app
# RUN npm install
# RUN npm install react-scripts@4.0.1 -g
# RUN npm run build

# RUN cp -r /app/build/* /usr/share/nginx/html/

# COPY nginx/nginx.conf /etc/nginx/conf.d

# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]