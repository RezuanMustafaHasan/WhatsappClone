# WhatsApp Clone

A real-time messaging application built with Node.js, Express, Socket.io, and MongoDB that mimics the core functionality of WhatsApp.

## Features

- **Real-time messaging** using Socket.io
- **User management** with unique usernames
- **Message persistence** with MongoDB
- **Responsive web interface** with EJS templating
- **User selection** for sender and receiver
- **Message history** between users
- **Real-time message delivery** to active users

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Real-time Communication**: Socket.io
- **Frontend**: EJS templating, Vanilla JavaScript
- **Styling**: CSS

## Project Structure

├── app.js              # Main application file
├── models/             # Database models
│   ├── Message.js      # Message schema
│   └── User.js         # User schema
├── public/             # Static files
│   ├── css/            # Stylesheets
│   │   └── style.css   # Main stylesheet
│   └── js/             # Client-side JavaScript
│       └── main.js     # Main JavaScript file
├── routes/             # Application routes
│   └── index.js        # Main routes
└── views/              # EJS templates
    └── index.ejs       # Main view


## Prerequisites

Before running this application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (running locally on port 27017)
- npm (comes with Node.js)

## Installation

1. **Clone the repository** (or navigate to the project directory):
   ```bash
   cd "WhatsApp clone"

   