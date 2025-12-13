# Stage 1: Build the React application
FROM node:18-alpine AS build

# Set the working directory
WORKDIR /app

# Copy root package.json and yarn.lock to leverage Docker cache
COPY package.json yarn.lock ./

# Copy workspace package.json files
COPY packages/types/package.json ./packages/types/package.json
COPY apps/client/package.json ./apps/client/package.json
COPY apps/api/package.json ./apps/api/package.json

# Install all dependencies using Yarn Workspaces
RUN yarn install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Build the client application
RUN yarn workspace client build

# Stage 2: Serve the application using Nginx
FROM nginx:stable-alpine

# Copy the build output from the build stage
COPY --from=build /app/apps/client/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]
