FROM node:20-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx svelte-kit sync && npm run build

FROM --platform=linux/amd64 node:20-slim
WORKDIR /app
COPY --from=build /app/build ./build
COPY --from=build /app/package*.json ./
RUN npm ci --omit=dev
ENV NODE_ENV=production PORT=3000
EXPOSE 3000
CMD ["node", "build"]
