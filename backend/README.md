# Backend Setup Guide

This guide will help you set up and run the backend server for the Smart Home project.

## Prerequisites

Make sure you have the following installed on your machine:
- Python 3.8 or higher
- pip (Python package installer)
- MySQL server

## Setup Instructions

1. **Clone the repository:**
   ```sh
   git clone <repository-url>
   cd backend
   ```

2. **Create and activate a virtual environment:**
   ```sh
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install the required packages:**
   ```sh
   pip install -r requirements.txt
   ```

4. **Apply database migrations:**
   ```sh
   python manage.py migrate
   ```

5. **Create a superuser (admin):**
   ```sh
   python manage.py createsuperuser
   ```

6. **Run the development server:**
   ```sh
   python manage.py runserver
   ```

## Accessing the Backend

- The backend server will be running at `http://127.0.0.1:8000/`.
- The admin panel can be accessed at `http://127.0.0.1:8000/admin/`.

## Additional Information

- For API documentation and testing, you can use the provided Postman collection: `Smart_home.postman_collection.json`.

If you encounter any issues, please refer to the project documentation or contact the backend development team.
