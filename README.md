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
- **PostgreSQL/MySQL/SQL Server** (configurable with TypeORM)

## 📄 Pre-requisites
Ensure you have the following installed:
- **Node.js** v20 or higher
- **npm** (Node Package Manager)
- **Docker**

## 🔍 Getting Started
Follow these steps to set up and run the project:

### 1. Clone the Repository
```bash
git clone https://github.com/DevDanielOB/teste-back-end.git
cd teste-back-end
# Branch: master or v.1.0.3
```

### 2. Install Dependencies
Install all required packages using npm:
```bash
npm install
```

### 3. Configure the Environment
Create a `.env` file in the root directory and configure the following variables or use the `.env.example`:
```env
################################# SQL ##########################################################
SQL_SERVER_DEVELOPMENT_BR=N
SQL_SERVER_HOST=localhost ## Or your host
SQL_SERVER_PORT=1433 ## Or your port
SQL_SERVER_USER='sa' ## Or your user
SQL_SERVER_PASSWORD='dados' ## Or your password
SQL_SERVER_DATABASE='db-teste-back-end'
SQL_SERVER_POOL_SIZE=200
SQL_SERVER_SSL=N
SQL_SERVER_TIMEOUT_SECONDS=30000
TYPEORM_APPLY_MIGRATION_ON_STARTUP='N'

##################### API ##########################################################
NODE_ENV='development'
PORT=3498 ## Or your port
JWT_SECRET='GqAUNp-hWjIJctiM0s4cDC33msGVmCAl2wCoueCeEvxFLKa2gE30VEfjNcSP9jLsBg3ei-svhJpOZ2TUWXuZTw'
APP_URL='http://localhost'
```

### 4. Set Up SQL Server Using Docker
If you don’t have an existing SQL Server instance, you can use Docker to set one up:

1. Pull the SQL Server image:
   ```bash
   docker pull mcr.microsoft.com/mssql/server:2022-latest
   ```
2. Run the container:
   ```bash
   docker run -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=SenhaForte123!' -p 1433:1433 --name sqlserver-container -d mcr.microsoft.com/mssql/server:2022-latest
   ```
3. Verify the container is running:
   ```bash
   docker ps
   ```
4. Update your `.env` file with the appropriate credentials (`SA_PASSWORD=SenhaForte123!`).

### 5. Start the Application
Run the server:
```bash
npm start
```

The application will be available at `http://localhost:3498`.

### 6. Access the API Documentation
Open the Swagger API documentation at:
```
http://localhost:3498/swagger#/
```

### 7. Unit tests
Run the tests:
```bash
yarn test # For unit tests
```
```bash
yarn test:cov # For unit tests with coverage
```

### 8. Future Features
- Add a queue for logical deletion of URLs without origin via RabbitMQ 🗑️.

## 🏆 Contribution
Contributions are welcome! Feel free to open issues or submit pull requests to improve the project.

