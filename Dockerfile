FROM node:20 AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps
COPY . ./
RUN npm run build

FROM node:20-slim
WORKDIR /app
COPY --from=build /app/dist /app/dist
CMD ["node", "/app/dist/home-dashboard/server/server.mjs"]
