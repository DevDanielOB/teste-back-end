# 🔗 URL Shortener Project

Welcome to the URL Shortener Project! This application provides a simple and efficient way to shorten long URLs, manage them, and redirect to the original links. Built with modern technologies, it ensures performance, scalability, and ease of use.

## 🚀 Features
- 🖋️ **Node.js** (v20+): Backend development.
- 🌐 **NestJS**: Framework for a structured and scalable architecture.
- 📊 **TypeORM**: Database manipulation and ORM.
- 📊 **Swagger**: Comprehensive API documentation.
- 🔐 **Authentication**: JWT-based auth

## 🎩 Technologies Used
- **Node.js** (v20 or higher)
- **NestJS**
- **TypeORM**
- **Swagger** for API documentation
- **PostgreSQL/MySQL** (configurable with TypeORM)

## 📄 Pre-requisites
Ensure you have the following installed:
- **Node.js** v20 or higher
- **npm** (Node Package Manager)
- **Database** (PostgreSQL or MySQL)

## 🔍 Getting Started
Follow these steps to set up and run the project:

### 1. Clone the Repository
```bash
git clone https://github.com/DevDanielOB/teste-back-end.git
cd url-shortener
```

### 2. Install Dependencies
Install all required packages using npm:
```bash
npm install
```

### 3. Configure the Environment
Create a `.env` file in the root directory and configure the following variables or use the .env.example
```env
################################# SQL ##########################################################
SQL_SERVER_DEVELOPMENT_BR=N
SQL_SERVER_HOST=localhost
SQL_SERVER_PORT=1433
SQL_SERVER_USER='sa'
SQL_SERVER_PASSWORD='dados'
SQL_SERVER_DATABASE='db-teste-back-end'
SQL_SERVER_POOL_SIZE=200
SQL_SERVER_SSL=N
SQL_SERVER_TIMEOUT_SECONDS=30000
TYPEORM_APPLY_MIGRATION_ON_STARTUP='N'

##################### API ##########################################################
NODE_ENV='development'
PORT=3498
JWT_SECRET='GqAUNp-hWjIJctiM0s4cDC33msGVmCAl2wCoueCeEvxFLKa2gE30VEfjNcSP9jLsBg3ei-svhJpOZ2TUWXuZTw'
APP_URL='http://localhost'

```

### 4. Start the Application
Run the server in development mode:
```bash
npm start
```

The application will be available at `http://localhost:3000`.

### 5. Access the API Documentation
Open the Swagger API documentation at:
```
http://localhost:3498/swagger#/
```

## 🏆 Contribution
Contributions are welcome! Feel free to open issues or submit pull requests to improve the project.

