FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock ./
COPY packages/types/package.json ./packages/types/package.json
COPY apps/api/package.json ./apps/api/package.json
COPY apps/client/package.json ./apps/client/package.json

RUN yarn install --frozen-lockfile

COPY apps/api/src ./apps/api/src
COPY apps/api/tsconfig.json ./apps/api/tsconfig.json
COPY packages/types/index.ts ./packages/types/index.ts

WORKDIR /app/apps/api

EXPOSE 8080

CMD ["yarn", "dev"]
