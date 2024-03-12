# Experianto File Storage Service

This repository contains the File Storage Service for the Experianto application, built using Nest.js.

## Setup

To run this service locally, follow these steps:

1. Copy the `.env.example` file to `.env`:
   ```
    cp .env.example .env
   ``` 
2. Install dependencies using yarn:
   ```
   yarn install
    ```
3. Start the development server in https://localhost:3030:
    ```
   yarn dev
      ```


## Endpoints

The following endpoints are available for health check:

- `GET /health`: See OK status.
- `GET /version`: See current version.

## Folder Structure

- **app**: Contains the main project modules, including controllers, services, and other application-specific logic.
- **assets**: Stores attachments and other assets used by the application.
- **config**: Holds configuration files for various aspects of the application, such as environment settings, database configurations, and email settings.
- **domain**: Houses the business logic of the application, including entities, value objects, domain services, and interfaces defining contracts.
- **infrastructure**: Handles communication with third-party services, including database interactions, external API calls, and other integrations.
