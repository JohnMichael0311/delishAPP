# Use official Node.js LTS image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production
ENV NODE_ENV=docker

# Copy rest of the backend code
COPY . .

# Expose the port (default 5000, change if your backend uses another)
EXPOSE 5000

# Start the server (edit if your entrypoint is different)
CMD ["npm", "start"]
