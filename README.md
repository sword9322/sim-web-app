# Project Setup Guide

This guide will help you set up and run the project on your local machine. Follow the steps below to get started.

## Prerequisites

- **Node.js**: Ensure you have Node.js installed. You can download it from [nodejs.org](https://nodejs.org/).
- **PHP**: Make sure PHP is installed on your system. You can use a local server environment like XAMPP or MAMP.
- **MySQL**: Ensure you have MySQL installed and running.

## Project Structure

- **Frontend**: The React application is located in the `src/components` directory.
- **Backend**: PHP files are located in the `src/api` directory.

## Setup Instructions

### 1. Clone the Repository

Clone the repository to your local machine using the following command:

```bash
git clone <repository-url>
```

### 2. Install Frontend Dependencies

Navigate to the project directory and install the necessary dependencies:

```bash
cd <project-directory>
npm install
```


### 3. Set Up the Backend

        1. **Move PHP Files**: Copy the PHP files from `src/api` to your local server's document root (e.g., `htdocs` for XAMPP or MAMP).

        2. **Create Database and Table**:
        - Create a MySQL database named `webapp`.
        - Run the following SQL command to create the `users` table:

        ```sql
        CREATE TABLE users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(50) NOT NULL,
            address VARCHAR(255) NOT NULL,
            city VARCHAR(100) NOT NULL,
            date_of_birth DATE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        ```

### 4. Update Fetch URLs

Ensure that the fetch URLs in the React components point to the correct local server address. For example, if using XAMPP, the URL should be `http://localhost/api/saveUser.php`.

### 5. Run the Application

1. **Start the Local Server**: Ensure your local server (e.g., XAMPP or MAMP) is running.
2. **Run the React Application**: Start the React development server:

```bash
npm start
```


### 6. Access the Application

Open your browser and navigate to `http://localhost:3000` to access the application.

## Troubleshooting

- **CORS Issues**: Ensure that the PHP files include the necessary CORS headers. For example, in `saveUser.php`:

```php
header("Access-Control-Allow-Origin: ");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
```


- **Database Connection**: Verify that the database credentials in the PHP files match your local MySQL setup.

## Relevant Code Snippets

- **UserForm Component**: Handles user form submission and data fetching.
  ```javascript:src/components/UserForm.js
  startLine: 6
  endLine: 62
  ```

- **saveUser.php**: PHP script for saving user data.
  ```php:src/api/saveUser.php
  startLine: 1
  endLine: 54
  ```

This setup should allow you to run the application locally and test its functionality.
Feel free to reach out if you encounter any issues or have questions!