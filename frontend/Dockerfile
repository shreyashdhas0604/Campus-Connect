# Use Node.js Alpine image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first
COPY package.json package-lock.json ./

# Use npm ci for clean install (faster and more reliable)
RUN npm ci

# Copy rest of the app
COPY . .

# Expose Vite's default port
EXPOSE 5173

# Start the app
CMD ["npm", "run", "dev"]
