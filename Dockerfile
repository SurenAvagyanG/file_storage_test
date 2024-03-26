# Use Node.js 20 Alpine as base image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN yarn install --production

# Copy the rest of the application code to the working directory
COPY . .

# Build the application (assuming you have a build script defined in package.json)
RUN yarn build

# Expose the port your app runs on
EXPOSE 3030

# Command to run the application
CMD ["yarn", "run", "start:prod"]
