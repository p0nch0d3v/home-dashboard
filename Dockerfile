FROM node:lts as build-step

ARG REACT_APP_OPENWEATHERMAP_API_KEY
ENV REACT_APP_OPENWEATHERMAP_API_KEY $REACT_APP_OPENWEATHERMAP_API_KEY

RUN mkdir /app
WORKDIR /app
COPY . /app
RUN npm install
RUN npm install react-scripts@4.0.3 -g

RUN touch /app/.env.production
RUN touch /app/.env
RUN echo "REACT_APP_OPENWEATHERMAP_API_KEY=$REACT_APP_OPENWEATHERMAP_API_KEY" >> /app/.env.production
RUN echo "REACT_APP_OPENWEATHERMAP_API_KEY=$REACT_APP_OPENWEATHERMAP_API_KEY" >> /app/.env

RUN npm run build

# Stage 2
FROM nginx:alpine
COPY --from=build-step /app/build /usr/share/nginx/html
