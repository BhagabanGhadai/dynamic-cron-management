# Stage 1: Base Image
# Use a lightweight Node.js version (Alpine Linux)
FROM node:22.22-alpine

# Stage 2: Environment Setup
# Set the working directory inside the container
WORKDIR /usr/src/app

# Stage 3: Dependencies
# Copy package.json and package-lock.json FIRST
# This allows Docker to cache dependencies if these files haven't changed
COPY package*.json ./

# Install dependencies
# 'npm ci' is faster and more reliable for builds than 'npm install'
RUN npm ci --only=production

# Stage 4: Copy Source
# Copy the rest of your application code
COPY . .

# Stage 5: Final Configuration
# Expose the port your app runs on (usually 3000 or 8080)
EXPOSE 3000

# Define the command to run your app
CMD [ "node", "index.js" ]
# OR if you use npm scripts:
# CMD [ "npm", "start" ]