# Backend API - Bill Sharing App

Express.js REST API with MongoDB.

## Tech Stack

- **Express.js** 5.1.0
- **MongoDB** 6.20.0 (native driver)
- **Joi** 18.0.1 (validation)
- **Babel** 7.28+ (transpilation)
- **dotenv** 17.2.3

## Getting Started

### Install Dependencies

```bash
npm install
```

### Environment Setup

Create a `.env` file in the root of `api/` directory:

```
MONGODB_URI=mongodb://localhost:27017
DATABASE_NAME=bill_sharing_app
APP_HOST=localhost
APP_PORT=8080
BUILD_MODE=dev
```

### Run Development Server

```bash
npm run dev
```

The API will run at http://localhost:8080

### Other Scripts

```bash
npm run build       # Build with Babel
npm run start       # Run production build
npm run production  # Build and run in production mode
npm run lint        # Run ESLint
```

## Project Structure

```
src/
├── server.js           # Express server entry point
├── config/             # Configuration (MongoDB, environment)
├── routes/             # API routes (v1, v2)
├── controllers/        # Request handlers
├── services/           # Business logic layer
├── models/             # Data models
├── validations/        # Joi validation schemas
├── middlewares/        # Express middlewares
└── utils/              # Utility functions
```

## API Endpoints

### v1

- `GET /v1/status` - Health check
- `POST /v1/boards` - Create new board

## Features

- MongoDB connection with Singleton pattern
- Joi validation middleware
- Global error handling