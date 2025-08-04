# Quick Test Guide - Verified Working Examples

This guide contains **verified working examples** for testing the MIS Web Backend API endpoints.

## ✅ **Verified Working Endpoints**

### 1. **Course Endpoints**
```bash
# Get all courses
curl -X GET http://localhost:8080/api/courses

# Get specific course
curl -X GET http://localhost:8080/api/courses/1
```

### 2. **Student Management**
```bash
# Create a new student
curl -X POST http://localhost:8080/api/admin/students \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "admissionNumber": "2024001",
    "dateOfBirth": "2000-01-01",
    "department": "Computer Science"
  }'

# Get student by ID
curl -X GET http://localhost:8080/api/students/4

# Update student
curl -X PUT http://localhost:8080/api/students/4 \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Smith",
    "email": "john.smith@example.com",
    "admissionNumber": "2024001",
    "dateOfBirth": "2000-01-01",
    "department": "Computer Science"
  }'
```

### 3. **Course Enrollment**
```bash
# Enroll student in a course
curl -X POST "http://localhost:8080/api/students/4/enrollments?courseId=1"

# Get student enrollments
curl -X GET http://localhost:8080/api/students/4/enrollments

# Drop a course
curl -X DELETE http://localhost:8080/api/students/4/enrollments/1
```

### 4. **Grade Management**
```bash
# Assign a grade
curl -X PUT "http://localhost:8080/api/admin/enrollments/1/grade?grade=A"

# Get student grades
curl -X GET http://localhost:8080/api/students/4/grades
```

### 5. **Course Management**
```bash
# Create a new course
curl -X POST http://localhost:8080/api/admin/courses \
  -H "Content-Type: application/json" \
  -d '{
    "courseCode": "CS201",
    "courseTitle": "Data Structures",
    "credits": 4,
    "description": "Advanced data structures and algorithms",
    "semester": "Spring 2025"
  }'

# Update a course
curl -X PUT http://localhost:8080/api/admin/courses/1 \
  -H "Content-Type: application/json" \
  -d '{
    "courseCode": "CS101",
    "courseTitle": "Introduction to Computer Science (Updated)",
    "credits": 3,
    "description": "Basic concepts of computer science and programming",
    "semester": "Fall 2024"
  }'
```

### 6. **Authentication (Optional)**
```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'

# Register new student (creates both user and student)
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Alice",
    "lastName": "Johnson",
    "email": "alice.johnson@example.com",
    "admissionNumber": "2024002",
    "dateOfBirth": "2001-05-15",
    "department": "Mathematics"
  }'
```

## 🧪 **Complete Test Workflow**

### Step 1: Verify Server is Running
```bash
curl -X GET http://localhost:8080/api/courses
```

### Step 2: Create a Student
```bash
curl -X POST http://localhost:8080/api/admin/students \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "Student",
    "email": "test.student@example.com",
    "admissionNumber": "TEST001",
    "dateOfBirth": "2000-01-01",
    "department": "Computer Science"
  }'
```

### Step 3: Enroll in Course
```bash
curl -X POST "http://localhost:8080/api/students/4/enrollments?courseId=1"
```

### Step 4: Assign Grade
```bash
curl -X PUT "http://localhost:8080/api/admin/enrollments/1/grade?grade=A"
```

### Step 5: Check Results
```bash
# Check enrollments
curl -X GET http://localhost:8080/api/students/4/enrollments

# Check grades
curl -X GET http://localhost:8080/api/students/4/grades
```

## 📊 **Expected Responses**

### Successful Student Creation
```json
{
  "id": 4,
  "firstName": "Test",
  "lastName": "Student",
  "email": "test.student@example.com",
  "admissionNumber": "TEST001",
  "dateOfBirth": "2000-01-01",
  "department": "Computer Science"
}
```

### Successful Enrollment
```json
{
  "id": 1,
  "studentId": 4,
  "courseId": 1,
  "studentName": "Test Student",
  "courseTitle": "Introduction to Computer Science",
  "enrollmentDate": "2025-08-04T13:12:27.113458",
  "grade": null
}
```

### Successful Grade Assignment
```json
{
  "id": 1,
  "studentId": 4,
  "courseId": 1,
  "studentName": "Test Student",
  "courseTitle": "Introduction to Computer Science",
  "enrollmentDate": "2025-08-04T13:12:27.113458",
  "grade": "A"
}
```

## 🎯 **Testing Checklist**

- [x] Server starts successfully
- [x] Can access `/api/courses` endpoint
- [x] Can create a new student
- [x] Can create a new course
- [x] Can enroll a student in a course
- [x] Can assign a grade
- [x] Can retrieve student grades
- [x] Can update student information
- [x] Authentication endpoints work (login/register)

## 🚀 **Quick Start Commands**

```bash
# Start the application
./mvnw spring-boot:run

# Test basic functionality
curl -X GET http://localhost:8080/api/courses

# Create a test student
curl -X POST http://localhost:8080/api/admin/students \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"Student","email":"test@example.com","admissionNumber":"TEST001","dateOfBirth":"2000-01-01","department":"Computer Science"}'
```

## 📝 **Notes**

- All endpoints are currently accessible without authentication
- The application creates sample courses on startup
- Student creation automatically creates a user account
- All responses are in JSON format
- The application runs on `http://localhost:8080` 