## Use Node.js 20 Alpine as base image
#FROM node:20-alpine
# Use Node.js 20 Alpine as base image from AWS ECR
ARG NODE_JS_IMAGE=node:20-alpine
FROM $NODE_JS_IMAGE

# Set the working directory in the container
WORKDIR /app

# Add npm registry authentication token as build argument
ARG EXPIA_NPM_TOKEN

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Set up .npmrc for authentication
RUN echo "//registry.yarnpkg.com/:_authToken=${EXPIA_NPM_TOKEN}" > .npmrc && \
    npm config set @fifth:registry https://registry.yarnpkg.com/

# Install dependencies
RUN yarn install

# Copy the rest of the application code to the working directory
COPY . .

ENV FS_S3_REGION=us-east-1
ENV FS_S3_BUCKET=experianto-development
ENV FS_S3_PATH=https://s3.amazonaws.com/experianto-development

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
