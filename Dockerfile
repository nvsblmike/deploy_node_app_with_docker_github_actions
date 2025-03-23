# Base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install --production

RUN npm install prom-client

# Copy the rest of the application files
COPY . .

# Expose application port (change if needed)
EXPOSE 3000

# Start the application
CMD ["node", "app.js"]
