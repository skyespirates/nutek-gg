FROM node:18-alpine AS base

WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .

FROM base AS builder
WORKDIR /app
RUN npm run build

FROM builder AS runner
EXPOSE 3000
CMD ["npm", "start"]