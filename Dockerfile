## Use Node.js 20 Alpine as base image
#FROM node:20-alpine
# Use Node.js 20 Alpine as base image from AWS ECR
ARG NODE_JS_IMAGE=node:20-alpine
FROM NODE_JS_IMAGE

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code to the working directory
COPY . .

# Build the application (assuming you have a build script defined in package.json)
RUN yarn build

# Expose the port your app runs on
EXPOSE 3030

# Environment Variables
ENV DD_TRACE_DEBUG="false"
ENV DD_TRACE_ENABLED="true"
ENV DD_LOGS_INJECTION="true"
ENV DD_PROFILING_ENABLED="true"
ENV DD_APPSEC_ENABLED="true"
ENV DD_IAST_ENABLED="true"

# Command to run the application
CMD ["yarn", "run", "start:prod"]
