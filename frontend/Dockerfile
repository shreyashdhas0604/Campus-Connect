# Build Stage
# FROM node:18-alpine AS build
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npm run build

# # Production Stage
# FROM nginx:stable-alpine
# COPY --from=build /app/dist /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]



# development stage
# Use an official node image 
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies (copy package.json and package-lock.json)
COPY package*.json ./
RUN npm install

# Copy the rest of the application code (if you don't rely solely on volumes)
COPY . .

# Expose port that your dev server runs on (e.g., 5173 for Vite)
EXPOSE 5173

# Start the development server
CMD ["npm", "run", "dev"]

