FROM node:18 AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Clear npm cache and remove any existing node_modules
RUN npm cache clean --force && \
    rm -rf node_modules package-lock.json

# Install dependencies with platform-specific binaries
RUN npm install --legacy-peer-deps --platform=linux --arch=x64
RUN npm install -g @angular/cli

# Copy the rest of the application code
COPY . .

# Install platform-specific rollup and build the application
RUN npm install @rollup/rollup-linux-x64-gnu --legacy-peer-deps
RUN npm run build --prod

# Stage 2: Serve the built application with Nginx
FROM nginx:alpine

# Copy custom nginx config to change the port to 4200
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built application from the build stage
COPY --from=build /app/dist/browser /usr/share/nginx/html

EXPOSE 4200

CMD ["nginx", "-g", "daemon off;"]