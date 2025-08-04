# MIS Web Backend MVP

A Spring Boot backend application for a Management Information System (MIS) web portal where students can manage their academic profiles, course enrollments, and view grades.

## Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (STUDENT, ADMIN)
- Secure password hashing with BCrypt

### Student Management
- Student profile management
- Course enrollment and withdrawal
- Grade viewing
- Profile updates

### Course Management
- Course catalog browsing
- Course details viewing
- Semester-based course organization

### Admin Functions
- Student registration
- Course creation and management
- Grade assignment
- System administration

## Technology Stack

- **Java 21**
- **Spring Boot 3.5.4**
- **Spring Security** with JWT
- **Spring Data JPA**
- **PostgreSQL** database
- **Lombok** for boilerplate reduction
- **Maven** for dependency management

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Register new student (Admin only)
- `GET /api/auth/me` - Get current user details

### Student Endpoints
- `GET /api/students/{id}` - Get student profile
- `PUT /api/students/{id}` - Update student profile
- `GET /api/students/{studentId}/enrollments` - View enrollments
- `POST /api/students/{studentId}/enrollments` - Enroll in course
- `DELETE /api/students/{studentId}/enrollments/{enrollmentId}` - Drop course
- `GET /api/students/{studentId}/grades` - View grades

### Course Endpoints
- `GET /api/courses` - List all courses
- `GET /api/courses/{id}` - Get course details

### Admin Endpoints
- `POST /api/admin/students` - Create student
- `PUT /api/admin/students/{id}` - Update student
- `POST /api/admin/courses` - Create course
- `PUT /api/admin/courses/{id}` - Update course
- `PUT /api/admin/enrollments/{enrollmentId}/grade` - Assign grade

## Setup Instructions

### Prerequisites
- Java 21
- Maven 3.6+
- PostgreSQL database

### Database Setup
1. Create a PostgreSQL database named `mis_db`
2. Update `application.properties` with your database credentials

### Running the Application
1. Clone the repository
2. Navigate to the project directory
3. Run: `mvn spring-boot:run`
4. Access the application at `http://localhost:8080`

### Default Admin Account
- Username: `admin`
- Password: `admin123`

## Database Schema

### Users Table
- id (Primary Key)
- username (Unique)
- password (Hashed)
- role (STUDENT/ADMIN)
- enabled

### Students Table
- id (Primary Key)
- user_id (Foreign Key to Users)
- first_name
- last_name
- email (Unique)
- admission_number (Unique)
- date_of_birth
- department

### Courses Table
- id (Primary Key)
- course_code (Unique)
- course_title
- credits
- description
- semester

### Enrollments Table
- id (Primary Key)
- student_id (Foreign Key to Students)
- course_id (Foreign Key to Courses)
- enrollment_date
- grade

## Security

- JWT tokens for stateless authentication
- Role-based authorization using Spring Security
- Password encryption with BCrypt
- CORS configuration for frontend integration

## Testing

Run tests with: `mvn test`

## API Documentation

The API follows RESTful conventions and returns JSON responses. All endpoints require authentication except for `/api/auth/login`.

### Example Login Request
```json
{
  "username": "admin",
  "password": "admin123"
}
```

### Example Login Response
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "username": "admin",
  "role": "ADMIN",
  "message": "Login successful"
}
```

## Future Enhancements

- Email notifications
- File upload functionality
- Advanced search and filtering
- Batch operations
- Reporting and analytics
- Mobile API support 