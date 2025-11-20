# Frontend - Bill Sharing App

React application built with Vite and Material-UI.

> Last updated: November 20, 2025 - Testing CI/CD deployment

## Tech Stack

- **React** 19.1.1
- **Vite** 7.1.7 (with SWC)
- **Material-UI** 7.3.4
- **Emotion** (CSS-in-JS)
- **Lodash** 4.17.21

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

The app will run at http://localhost:5173

### Other Scripts

```bash
npm run build       # Build for production
npm run preview     # Preview production build
npm run lint        # Run ESLint
npm run host        # Host on network
```

## Project Structure

```
src/
├── components/     # Reusable UI components (AppBar, ModeSelect)
├── pages/          # Page components (Boards, Auth, Users)
├── context/        # React Context API
├── redux/          # Redux store
├── apis/           # API integration
├── utils/          # Utility functions and constants
├── guards/         # Route guards
└── hooks/          # Custom React hooks
```

## Features

- Material-UI component library
- Dark/Light theme support
- Responsive navigation bar
- Board management UI
