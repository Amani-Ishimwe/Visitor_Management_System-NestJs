# Visitor Management System (VMS) Backend

A comprehensive NestJS-based backend system for managing visitors, departments, and user access control in organizations.

## 🚀 Features

- **Visitor Management**: Register and track visitors with their visit history
- **Department Management**: Organize departments with associated users and visits
- **User Authentication**: Secure user authentication with JWT tokens and role-based access control
- **Email Notifications**: Automated email notifications for visitor registration and password resets
- **File Upload**: Profile picture uploads using Cloudinary
- **OTP Verification**: Secure OTP-based password reset functionality
- **Database Relations**: Full implementation of Prisma relations between all entities

## 🏗️ Architecture

### Database Models & Relations

The system uses PostgreSQL with Prisma ORM and includes the following models with their relations:

- **Visitor** (1:N) → **Visit**: A visitor can have multiple visits
- **Department** (1:N) → **Visit**: A department can have multiple visits
- **Department** (1:N) → **User**: A department can have multiple users
- **User** (N:1) → **Department**: A user belongs to one department (optional for receptionists)
- **Visit** (N:1) → **Visitor**: A visit belongs to one visitor
- **Visit** (N:1) → **Department**: A visit belongs to one department

### User Roles

- **ADMIN**: Full system access
- **RECEPTIONIST**: Limited access, can manage visitors and visits

## 🛠️ Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **File Upload**: Cloudinary
- **Email**: Nodemailer with EJS templates
- **Password Hashing**: Argon2
- **Package Manager**: pnpm

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- pnpm package manager
- Cloudinary account (for file uploads)

## 🚀 Installation & Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd vms-backend
   ```
2. **Install dependencies**

   ```bash
   pnpm install
   ```
3. **Environment Configuration**
   Create a `.env` file in the root directory:

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/vms_db"
   JWT_SECRET="your-jwt-secret-key"
   CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
   CLOUDINARY_API_KEY="your-cloudinary-api-key"
   CLOUDINARY_API_SECRET="your-cloudinary-api-secret"
   EMAIL_HOST="smtp.gmail.com"
   EMAIL_PORT=587
   EMAIL_USER="your-email@gmail.com"
   EMAIL_PASS="your-app-password"
   ```
4. **Database Setup**

   ```bash
   # Generate Prisma client
   pnpm prisma generate

   # Run database migrations
   pnpm prisma migrate dev

   # (Optional) Seed the database
   pnpm prisma db seed
   ```
5. **Start the application**

   ```bash
   # Development mode
   pnpm run start:dev

   # Production mode
   pnpm run start:prod
   ```

The API will be available at `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints

#### Register User

```http
POST /users/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "ADMIN"
}
```

#### Login User

```http
POST /users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Verify User

```http
GET /users/verify/{userId}/{email}
```

#### Reset Password Request

```http
POST /users/reset-password-request
Content-Type: application/json

{
  "email": "john@example.com"
}
```

#### Verify OTP

```http
POST /users/verify-otp
Content-Type: application/json

{
  "otp": "1234",
  "email": "john@example.com"
}
```

### Visitor Management

#### Create Visitor

```http
POST /visitors
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@visitor.com",
  "phone": "+1234567890"
}
```

#### Get All Visitors (with visits)

```http
GET /visitors
Authorization: Bearer <jwt-token>
```

#### Get Visitor by ID (with visits)

```http
GET /visitors/{visitorId}
Authorization: Bearer <jwt-token>
```

### Department Management

#### Create Department

```http
POST /departments
Content-Type: application/json
Authorization: Bearer <jwt-token>

{
  "name": "IT Department",
  "email": "it@company.com",
  "description": "Information Technology Department"
}
```

#### Get All Departments (with visits and users)

```http
GET /departments
Authorization: Bearer <jwt-token>
```

#### Get Department by ID (with visits and users)

```http
GET /departments/{departmentId}
Authorization: Bearer <jwt-token>
```

### Visit Management

#### Create Visit

```http
POST /visit
Content-Type: application/json
Authorization: Bearer <jwt-token>

{
  "visitorId": "visitor-uuid",
  "departmentId": "department-uuid",
  "purpose": "Business Meeting",
  "status": "ACTIVE",
  "entryTime": "2024-01-15T09:00:00Z",
  "exitTime": "2024-01-15T17:00:00Z"
}
```

#### Get All Visits (with visitor and department details)

```http
GET /visit
Authorization: Bearer <jwt-token>
```

#### Get Visit by ID (with visitor and department details)

```http
GET /visit/{visitId}
Authorization: Bearer <jwt-token>
```

#### Update Visit

```http
PATCH /visit/{visitId}
Content-Type: application/json
Authorization: Bearer <jwt-token>

{
  "status": "CHECKED_OUT",
  "exitTime": "2024-01-15T17:30:00Z"
}
```

### User Management

#### Get All Users (with department details)

```http
GET /users
Authorization: Bearer <jwt-token>
```

#### Get User by ID (with department details)

```http
GET /users/{userId}
Authorization: Bearer <jwt-token>
```

#### Update User Profile

```http
PATCH /users/{userId}/profile
Authorization: Bearer <jwt-token>
Content-Type: multipart/form-data

// Include profile image file
```

## 🔐 Authentication & Authorization

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <jwt-token>
```

### Role-Based Access Control

- **ADMIN**: Can access all endpoints
- **RECEPTIONIST**: Limited access to visitor and visit management

## 📧 Email Features

The system sends automated emails for:

- Visitor registration confirmation
- Department creation notifications
- Password reset requests
- User verification

## 🗄️ Database Relations Implementation

All Prisma relations are fully implemented in the backend:

- **Visitor-Visit**: When fetching visitors, their visits are included
- **Department-Visit**: When fetching departments, their visits are included
- **Department-User**: When fetching departments, their users are included
- **User-Department**: When fetching users, their department is included
- **Visit-Visitor**: When fetching visits, visitor details are included
- **Visit-Department**: When fetching visits, department details are included

## 🧪 Testing

```bash
# Unit tests
pnpm run test

# E2E tests
pnpm run test:e2e

# Test coverage
pnpm run test:cov
```

## 📁 Project Structure

```
src/
├── app.module.ts              # Main application module
├── main.ts                    # Application entry point
├── users/                     # User management
├── visitors/                  # Visitor management
├── departments/               # Department management
├── visit/                     # Visit management
├── email/                     # Email service and templates
├── cloudinary/                # File upload service
├── database/                  # Database service
├── guards/                    # Authentication guards
├── decorators/                # Custom decorators
└── utils/                     # Utility functions
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository.`<p align="center">`
  `<a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />``</a>`

</p>
