
---

# Streamify - Video Streaming Platform

## Table of Contents
- [Introduction](#introduction)
- [Design of the Solution](#design-of-the-solution)
- [Hardware and Software Requirements](#hardware-and-software-requirements)
- [Installation Instructions](#installation-instructions)
- [Project Structure](#project-structure)
- [Explanation of the Project](#explanation-of-the-project)
- [Future Enhancements](#future-enhancements)

---

## Introduction

**Streamify** is a video streaming platform developed using the MERN stack (MongoDB, Express.js, React.js, Node.js). The project focuses on building a scalable and functional video streaming site similar to popular platforms, with features like user authentication, video management, subscriptions, comments, likes, and more.

---

## Design of the Solution

### User Authentication
- New users can **register** using a username, email ID, and password.
- Existing users can **log in** using their email and password to manage profiles.
- Password Reset functionality via email-based verification.

### Video Management
- Users can **upload**, **view**, **comment**, and **like** videos.
- Videos display total **views** and can be **searched** by keywords.

### Subscriptions
- Users can **subscribe** to other users to receive updates on their uploads.

### Comments and Replies
- Users can **comment** on videos and reply to other comments.

### Likes & Views
- Users can **like** the videos and track video **views**.

### Search Functionality
- Users can **search** for videos by entering keywords related to the content.

---

## Hardware and Software Requirements

### Hardware:
- **Computer/Laptop**: For development and testing.
- **Server** (optional): For hosting the application (for production deployment).

### Software:
- **Operating System**: MacOS (or any OS with Node.js and MongoDB support).
- **Node.js**: JavaScript runtime for backend server development.
- **MongoDB**: NoSQL database for storing user and video data.
- **Express.js**: Web framework for Node.js.
- **React.js**: Frontend library for building user interfaces.
- **Postman**: API testing tool.
- **VS Code**: Code editor.
- **Homebrew**: Package manager for macOS (if using macOS).
- **Git & GitHub**: Version control.

---

## Installation Instructions

### Clone the Repository:
```bash
git clone https://github.com/MeghanaKiran77/Streamify.git
cd Streamify
```

### Backend Setup:
1. Navigate to the `server` folder:
   ```bash
   cd server
   ```
2. Install server dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` folder with the following content:
   ```
   MONGO_URI=your_mongo_database_uri
   JWT_SECRET=your_jwt_secret
   ```

4. Run the server:
   ```bash
   npm run dev
   ```

### Frontend Setup:
1. Navigate to the `client` folder:
   ```bash
   cd ../client
   ```
2. Install client dependencies:
   ```bash
   npm install
   ```
3. Run the React application:
   ```bash
   npm start
   ```

---

## Project Structure

```bash
.
├── client/           # React frontend code
│   ├── src/
│   │   ├── components/
│   │   └── pages/
│   └── public/
├── server/           # Node.js/Express backend
│   ├── config/       # MongoDB configuration
│   ├── controllers/  # Logic for handling API requests
│   ├── middlewares/  # Authentication and error handling
│   ├── models/       # Mongoose schemas for MongoDB
│   ├── routes/       # API route definitions
│   └── uploads/      # Folder for uploaded video files
├── .gitignore        # Git ignored files
├── .env              # Environment variables for server
├── app.js            # Express app setup and middleware
├── package.json      # Dependencies and scripts
└── README.md         # Project documentation
```

---

## Explanation of the Project

### client/
- **Purpose**: Frontend code of the application.
- **Structure**: Includes `components/` and `pages/` folders containing React components such as:
  - `Home.js`, `Login.js`, `Header.js`, `Footer.js`
  - `LikeButton.js`, `Profile.js`, `VideoUpload.js`, `VideoPlayback.js`, etc.
  
### server/
- **config/db.js**: Configures and connects to MongoDB.
- **controllers/**
  - `authController.js`: Handles user registration, login, and password reset.
  - `userController.js`: Manages user subscriptions, user profile retrieval, etc.
  - `videoController.js`: Handles video uploading, comments, and replies.
- **middlewares/authMiddleware.js**: Verifies JWT token for protected routes.
- **models/**
  - `User.js`: Schema for user data (username, email, password, etc.).
  - `Video.js`: Schema for video data (title, description, likes, views, etc.).
- **routes/**
  - `authRoutes.js`: Routes for registration, login, and password reset.
  - `userRoutes.js`: Routes for user profiles and subscription management.
  - `videoRoutes.js`: Routes for video upload, comment, and reply features.
- **uploads/**: Stores uploaded video files.
- **app.js**: Initializes the Express app, defines routes, and adds middleware.
- **server.js**: Entry point for starting the backend server.

---

## Future Enhancements

- **Video Categories**: Users can filter videos by categories like education, entertainment, etc.
- **Live Streaming**: Allow users to live-stream their content.
- **Video Recommendations**: Suggest videos based on user preferences and history.
- **Real-time Chat**: Add real-time chat functionality for live-streamed videos.

---
