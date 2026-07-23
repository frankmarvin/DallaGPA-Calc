# Use Node.js 18 Alpine (lightweight)
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the TypeScript code
RUN npm run build

# Expose the backend port
EXPOSE 5000

# Start the server
CMD ["node", "dist/server.js"]
