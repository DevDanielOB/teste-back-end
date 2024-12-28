# 🔗 URL Shortener Project

Welcome to the URL Shortener Project! This application provides a simple and efficient way to shorten long URLs, manage them, and redirect to the original links. Built with modern technologies, it ensures performance, scalability, and ease of use.

## 🚀 Features
- 🖋️ **Node.js** (v20+): Backend development.
- 🌐 **NestJS**: Framework for a structured and scalable architecture.
- 📊 **TypeORM**: Database manipulation and ORM.
- 📊 **Swagger**: Comprehensive API documentation.
- 🔐 **Authentication**: Secure access using tokens.
- ⏳ **Scheduled Cleanup**: Automatically deletes old anonymous URLs.

## 🎩 Technologies Used
- **Node.js** (v20 or higher)
- **NestJS**
- **TypeORM**
- **Swagger** for API documentation
- **PostgreSQL/MySQL** (configurable with TypeORM)

## 📄 Prerequisites
Ensure you have the following installed:
- **Node.js** v20 or higher
- **npm** (Node Package Manager)
- **Database** (PostgreSQL or MySQL)

## 🔍 Getting Started
Follow these steps to set up and run the project:

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/url-shortener.git
cd url-shortener
```

### 2. Install Dependencies
Install all required packages using npm:
```bash
npm install
```

### 3. Configure the Environment
Create a `.env` file in the root directory and configure the following variables:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=url_shortener
BASE_URL=http://localhost:3000
JWT_SECRET=your_secret_key
```

### 4. Run Migrations
Apply the database migrations:
```bash
npm run migration:run
```

### 5. Start the Application
Run the server in development mode:
```bash
npm run start:dev
```

The application will be available at `http://localhost:3000`.

### 6. Access the API Documentation
Open the Swagger API documentation at:
```
http://localhost:3000/api
```

## 🏆 Contribution
Contributions are welcome! Feel free to open issues or submit pull requests to improve the project.

## 🙏 Acknowledgments
Thanks to the open-source community for providing such powerful tools and frameworks to build this project.

