# Smart Home Project

A comprehensive smart home management system that allows you to monitor and control various devices throughout your home.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Setting Up the Backend](#setting-up-the-backend)
  - [Setting Up the Frontend](#setting-up-the-frontend)
- [How to Use](#how-to-use)
- [Troubleshooting](#troubleshooting)

## Overview

This Smart Home Project is a web-based application that helps you manage and monitor your home devices. The application consists of a React frontend and a Django backend. You can control devices like lights, fans, and doors, view usage statistics, and manage user access.

## Features

- **User Authentication**: Secure login and registration system
- **Device Control**: Turn on/off lights, fans, and control doors
- **Usage Statistics**: Monitor energy usage and device activities
- **User Management**: Add family members and manage access
- **Dashboard**: View real-time status of all connected devices
- **Room Management**: Group devices by rooms for easier control

## Installation

### Prerequisites

Before you begin, make sure you have the following installed:
- Python 3.9 or higher
- Node.js 14 or higher
- npm or yarn
- MySQL (recommended) or SQLite

### Setting Up the Backend

1. **Clone the repository**
   ```
   git clone https://github.com/yourusername/Smart_Home_Project.git
   cd Smart_Home_Project
   ```

2. **Create and activate a virtual environment**
   ```
   # For Windows
   cd backend
   python -m venv .venv
   .venv\Scripts\activate

   # For macOS/Linux
   cd backend
   python -m venv .venv
   source .venv/bin/activate
   ```

3. **Install dependencies**
   ```
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   Create a `.env` file in the backend directory with the following:
   ```
   DEBUG=True
   SECRET_KEY=your_secret_key
   DATABASE_URL=mysql://user:password@localhost:3306/smart_home_db
   # Or for SQLite
   # DATABASE_URL=sqlite:///db.sqlite3
   ```

5. **Set up the database**
   ```
   python manage.py migrate
   ```

6. **Create an admin user**
   ```
   python manage.py createsuperuser
   ```

7. **Run the backend server**
   ```
   python manage.py runserver
   ```
   The backend will start at http://localhost:8000/

### Setting Up the Frontend

1. **Navigate to the frontend directory**
   ```
   cd ../frontend
   ```

2. **Install dependencies**
   ```
   # Using npm
   npm install

   # Using yarn
   yarn install
   ```

3. **Create environment file**
   Create a `.env` file in the frontend directory with:
   ```
   REACT_APP_API_URL=http://localhost:8000/api
   ```

4. **Start the frontend development server**
   ```
   # Using npm
   npm start

   # Using yarn
   yarn start
   ```
   The frontend will start at http://localhost:3000/

## How to Use

1. **Login or Register**
   - Open your browser and go to http://localhost:3000/
   - Register a new account or login with existing credentials

2. **Dashboard**
   - View all connected devices and their status
   - See a summary of your home's current state

3. **Control Devices**
   - Click on any device to control it
   - Turn lights on/off, open/close doors, or adjust fan speeds

4. **View Statistics**
   - Navigate to the Statistics page to view device usage data
   - Filter by device type, room, or time period

5. **Manage Users**
   - Add family members
   - Assign access permissions

## Troubleshooting

- **Backend won't start**
  - Check if the virtual environment is activated
  - Verify that all required packages are installed
  - Make sure the database settings are correct

- **Frontend won't start**
  - Check if Node.js is installed properly
  - Verify that all dependencies are installed
  - Check the `.env` file for correct API URL

- **Can't connect to devices**
  - Ensure the backend server is running
  - Check your network connection
  - Verify that the device is registered in the system

For more detailed information or technical support, please contact the development team.
