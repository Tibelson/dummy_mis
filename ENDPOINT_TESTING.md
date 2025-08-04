# API Endpoint Testing Guide

This guide shows you how to test all the API endpoints in the MIS Web Backend application.

## 🚀 Quick Start

The application is now running with security bypassed, so you can test all endpoints without authentication!

## 📋 Available Endpoints

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Register new student
- `GET /api/auth/me` - Get current user details

### Course Endpoints
- `GET /api/courses` - List all courses
- `GET /api/courses/{id}` - Get course by ID

### Student Endpoints
- `GET /api/students/{id}` - Get student by ID
- `PUT /api/students/{id}` - Update student
- `GET /api/students/{studentId}/enrollments` - Get student enrollments
- `POST /api/students/{studentId}/enrollments` - Enroll student in course
- `DELETE /api/students/{studentId}/enrollments/{enrollmentId}` - Drop course
- `GET /api/students/{studentId}/grades` - Get student grades

### Admin Endpoints
- `POST /api/admin/students` - Create student
- `PUT /api/admin/students/{id}` - Update student
- `POST /api/admin/courses` - Create course
- `PUT /api/admin/courses/{id}` - Update course
- `PUT /api/admin/enrollments/{enrollmentId}/grade` - Assign grade

## 🧪 Testing Methods

### Method 1: Using curl (Command Line)

#### Test Course Endpoints
```bash
# Get all courses
curl -X GET http://localhost:8080/api/courses

# Get course by ID
curl -X GET http://localhost:8080/api/courses/1
```

#### Test Student Endpoints
```bash
# Get student by ID (if exists)
curl -X GET http://localhost:8080/api/students/1

# Update student
curl -X PUT http://localhost:8080/api/students/1 \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "admissionNumber": "2024001",
    "dateOfBirth": "2000-01-01",
    "department": "Computer Science"
  }'

# Get student enrollments
curl -X GET http://localhost:8080/api/students/1/enrollments

# Enroll student in course
curl -X POST "http://localhost:8080/api/students/1/enrollments?courseId=1"

# Get student grades
curl -X GET http://localhost:8080/api/students/1/grades
```

#### Test Admin Endpoints
```bash
# Create new student
curl -X POST http://localhost:8080/api/admin/students \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@example.com",
    "admissionNumber": "2024002",
    "dateOfBirth": "2001-05-15",
    "department": "Mathematics"
  }'

# Create new course
curl -X POST http://localhost:8080/api/admin/courses \
  -H "Content-Type: application/json" \
  -d '{
    "courseCode": "CS201",
    "courseTitle": "Data Structures",
    "credits": 4,
    "description": "Advanced data structures and algorithms",
    "semester": "Spring 2025"
  }'

# Assign grade to enrollment
curl -X PUT "http://localhost:8080/api/admin/enrollments/1/grade?grade=A"
```

#### Test Authentication Endpoints
```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'

# Register new student
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Alice",
    "lastName": "Johnson",
    "email": "alice.johnson@example.com",
    "admissionNumber": "2024003",
    "dateOfBirth": "2002-03-20",
    "department": "Physics"
  }'
```

### Method 2: Using Postman

1. **Import the collection** (create a new collection in Postman)
2. **Set base URL**: `http://localhost:8080`
3. **Add requests** for each endpoint

#### Example Postman Requests:

**Get All Courses**
- Method: `GET`
- URL: `{{baseUrl}}/api/courses`

**Create Student**
- Method: `POST`
- URL: `{{baseUrl}}/api/admin/students`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "firstName": "Bob",
  "lastName": "Wilson",
  "email": "bob.wilson@example.com",
  "admissionNumber": "2024004",
  "dateOfBirth": "2003-07-10",
  "department": "Chemistry"
}
```

### Method 3: Using JavaScript/Fetch

```javascript
// Get all courses
fetch('http://localhost:8080/api/courses')
  .then(response => response.json())
  .then(data => console.log(data));

// Create a new student
fetch('http://localhost:8080/api/admin/students', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    firstName: 'Charlie',
    lastName: 'Brown',
    email: 'charlie.brown@example.com',
    admissionNumber: '2024005',
    dateOfBirth: '2004-09-25',
    department: 'Biology'
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

### Method 4: Using Python Requests

```python
import requests
import json

base_url = "http://localhost:8080"

# Get all courses
response = requests.get(f"{base_url}/api/courses")
print(response.json())

# Create a new student
student_data = {
    "firstName": "David",
    "lastName": "Miller",
    "email": "david.miller@example.com",
    "admissionNumber": "2024006",
    "dateOfBirth": "2005-11-30",
    "department": "Engineering"
}

response = requests.post(
    f"{base_url}/api/admin/students",
    headers={"Content-Type": "application/json"},
    data=json.dumps(student_data)
)
print(response.json())
```

## 🧪 Complete Testing Workflow

### Step 1: Test Basic Endpoints
```bash
# Test if server is running
curl http://localhost:8080/api/courses

# Should return the sample courses created by DataInitializer
```

### Step 2: Test Student Creation
```bash
# Create a new student
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

### Step 3: Test Course Enrollment
```bash
# Enroll the student in a course
curl -X POST "http://localhost:8080/api/students/1/enrollments?courseId=1"

# Check enrollments
curl -X GET http://localhost:8080/api/students/1/enrollments
```

### Step 4: Test Grade Assignment
```bash
# Assign a grade
curl -X PUT "http://localhost:8080/api/admin/enrollments/1/grade?grade=A"

# Check grades
curl -X GET http://localhost:8080/api/students/1/grades
```

## 📊 Expected Responses

### Successful Course Response
```json
[
  {
    "id": 1,
    "courseCode": "CS101",
    "courseTitle": "Introduction to Computer Science",
    "credits": 3,
    "description": "Basic concepts of computer science and programming",
    "semester": "Fall 2024"
  }
]
```

### Successful Student Creation Response
```json
{
  "id": 1,
  "firstName": "Test",
  "lastName": "Student",
  "email": "test.student@example.com",
  "admissionNumber": "TEST001",
  "dateOfBirth": "2000-01-01",
  "department": "Computer Science"
}
```

### Successful Login Response
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "username": "admin",
  "role": "ADMIN",
  "message": "Login successful"
}
```

## 🐛 Troubleshooting

### Common Issues:

1. **Connection Refused**: Make sure the application is running
   ```bash
   ./mvnw spring-boot:run
   ```

2. **404 Not Found**: Check the endpoint URL
   ```bash
   # Correct
   curl http://localhost:8080/api/courses
   
   # Wrong
   curl http://localhost:8080/courses
   ```

3. **400 Bad Request**: Check JSON format
   ```bash
   # Make sure JSON is properly formatted
   curl -X POST http://localhost:8080/api/admin/students \
     -H "Content-Type: application/json" \
     -d '{"firstName":"John","lastName":"Doe"}'
   ```

4. **500 Internal Server Error**: Check server logs
   ```bash
   # Look at the application logs for error details
   ```

## 🎯 Testing Checklist

- [ ] Server starts successfully
- [ ] Can access `/api/courses` endpoint
- [ ] Can create a new student
- [ ] Can create a new course
- [ ] Can enroll a student in a course
- [ ] Can assign a grade
- [ ] Can retrieve student grades
- [ ] Can update student information
- [ ] Authentication endpoints work (login/register)

## 📝 Notes

- All endpoints are currently accessible without authentication
- The application creates sample data on startup
- Use the provided examples to test all functionality
- Remember to use proper JSON formatting in requests
- Check the server logs for detailed error information 