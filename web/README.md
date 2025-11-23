# Splitly Web Frontend

A modern, responsive React application for managing shared expenses and bill splitting. Built with React, Redux Toolkit, and Material-UI with Vietnamese localization.

## 🚀 Features

### 🎨 **Modern UI/UX**
- **Beautiful Landing Page**: Animated hero section with rotating text and aurora background effects
- **Responsive Design**: Mobile-first approach with Tailwind CSS and Material-UI
- **Vietnamese Localization**: Complete Vietnamese language support
- **Aurora Background**: Custom animated background with soft pink/rose color palette
- **Interactive Elements**: Smooth animations and hover effects throughout

### 🔐 **Authentication**
- **Login/Register Forms**: Separate authentication components with form validation
- **JWT Token Management**: Secure authentication with automatic token refresh
- **Protected Routes**: Route guards for authenticated areas
- **Account Verification**: Email-based account verification system
- **Profile Management**: User profile editing and settings

### 💰 **Advanced Bill Management**
- **3 Bill Types**:
  - **Equal Split**: Automatically divide bills equally among participants
  - **By Person**: Manual amount allocation per participant
  - **By Item**: Allocate specific items to different participants
- **Smart Calculations**: Real-time amount calculations and validation
- **Participant Management**: Add/remove participants with search functionality
- **Category Selection**: Predefined expense categories
- **OCR Integration**: Scan receipts to auto-populate bill details
- **Payment Tracking**: Track who paid and who owes what

### 🔔 **Real-time Notifications**
- **Socket.IO Integration**: Live notifications for bill updates
- **Reading State Management**: Track read/unread status across devices
- **Multiple Notification Types**: Bill creation, payment reminders, settlements
- **Cross-device Sync**: Notification state synced across user's devices

### 👥 **Group Management**
- **Create Groups**: Modal-based group creation with member management
- **Member Management**: Add/remove members with role-based permissions
- **Group Statistics**: Track total expenses and member contributions
- **Group Details**: Individual pages for each group with bill history

### 🤖 **AI Features**
- **Chatbot Integration**: Context-aware AI assistant for expense help
- **Smart Suggestions**: AI-powered expense categorization
- **Bill Parsing**: Intelligent bill data extraction

## 🛠 Tech Stack

- **React** 19.1.1
- **Vite** 7.1.7 (with SWC)
- **Material-UI** 7.3.4
- **Emotion** (CSS-in-JS)
- **Redux Toolkit** 2.9.2
- **React Router** 7.1.5
- **Axios** 1.13.0
- **Day.js** 1.11.19
- **Framer Motion** 12.23.24
- **Socket.IO Client** 4.8.1
- **Tailwind CSS** 3.5.7
- **Lodash** 4.17.21

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup Steps

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Create a `.env` file:
   ```env
   VITE_API_ROOT=http://localhost:8017
   VITE_WEBSITE_DOMAIN=http://localhost:5173
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   The app will run at http://localhost:5173

4. **Build for production**
   ```bash
   npm run build
   ```

## 🏗 Project Structure

```
web/
├── public/               # Static assets
├── src/
│   ├── apis/            # API integration layer
│   ├── assets/          # Images, fonts, static files
│   ├── components/      # Reusable UI components
│   │   ├── Bills/       # Bill-specific components
│   │   ├── Form/        # Form components
│   │   ├── Group/       # Group management components
│   │   ├── Layout/      # Layout components
│   │   └── ...
│   ├── context/         # React contexts (Chatbot, etc.)
│   ├── guards/          # Route protection
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   │   ├── Auth/        # Authentication pages
│   │   ├── Bills/       # Bill management pages
│   │   ├── Boards/      # Group/Board pages
│   │   ├── Dashboard/   # Main dashboard
│   │   ├── Landing/     # Landing page components
│   │   └── ...
│   ├── redux/           # Redux store and slices
│   │   ├── bill/        # Bill state management
│   │   ├── notification/# Notification state
│   │   ├── user/        # User state
│   │   └── store.js     # Redux store configuration
│   ├── utils/           # Utility functions
│   ├── App.jsx          # Main App component
│   ├── main.jsx         # Application entry point
│   └── theme.js         # Theme configuration
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── postcss.config.js    # PostCSS configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── vite.config.js       # Vite configuration
```

## 🎨 Key Components

### Landing Page
- `HeroSection.jsx` - Animated hero with rotating text
- `FeaturesSection.jsx` - Feature highlights
- `HowItWorksSection.jsx` - Process explanation
- `TestimonialsSection.jsx` - User testimonials
- `Aurora.jsx` - Animated background component

### Bill Management
- `BillCreate.jsx` - Comprehensive bill creation form
- `BillDetail.jsx` - Bill details and management
- `ParticipantsSection.jsx` - Participant management
- `EqualSplitDetails.jsx` - Equal split interface
- `ByPersonSplitDetails.jsx` - Person-based split
- `ByItemSplitDetails.jsx` - Item-based split

### Authentication
- `Auth.jsx` - Main authentication wrapper
- `LoginForm.jsx` - Login interface
- `RegisterForm.jsx` - Registration interface
- `Profile.jsx` - User profile management

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- `npm run host` - Start dev server with network access
- `npm run production` - Preview production build with host

### Development Guidelines

1. **Component Structure**: Use functional components with hooks
2. **State Management**: Use Redux for global state, useState for local state
3. **Styling**: Prefer Tailwind classes, use MUI components for complex UI
4. **File Naming**: Use PascalCase for components, camelCase for utilities
5. **Import Organization**: Group imports by type (React, third-party, local)

### Redux Store Structure

- `user/userSlice.js` - User authentication and profile
- `bill/activeBillSlice.js` - Bill creation and management
- `notification/notificationSlice.js` - Notification system

## 🚀 Deployment

### Production Build

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Environment Variables

Production environment variables:
```env
VITE_API_ROOT=https://your-api-domain.com
VITE_WEBSITE_DOMAIN=https://your-frontend-domain.com
```

---