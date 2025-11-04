# Use Node.js LTS image
FROM node:18-alpine

# Set working directory
WORKDIR /src

# Copy package files first for caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the source code
COPY . .

# Expose port (same as your Express app)
EXPOSE 5000

# Run the server
CMD ["npm", "run", "dev"]
