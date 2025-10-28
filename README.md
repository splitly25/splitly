# Bill Sharing App

A monorepo project for managing and splitting bills between users.

## Project Structure

```
├── web/     # Frontend - React + Vite + Material-UI
├── api/     # Backend - Express.js + MongoDB
```

## Tech Stack

**Frontend**: React, Vite, Material-UI
**Backend**: Express.js, MongoDB, Joi

## Quick Start

### Prerequisites
- Node.js
- MongoDB

### Installation

Install dependencies for both frontend and backend:

```bash
# Frontend
cd web
npm install

# Backend
cd api
npm install
```

### Environment Setup

Create `.env` file in `api/` directory:

```
MONGODB_URI=your_mongodb_connection_string
DATABASE_NAME=your_database_name
APP_HOST=localhost
APP_PORT=8080
BUILD_MODE=dev
```

### Running the Application

**Frontend** (default: http://localhost:5173):
```bash
cd web
npm run dev
```

**Backend** (default: http://localhost:8080):
```bash
cd api
npm run dev
```

## Available Scripts

See individual README files in `web/` and `api/` directories for more details.
