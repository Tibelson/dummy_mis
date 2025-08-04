# Frontend Integration Guide

This guide shows you how to integrate your frontend application with the MIS Web Backend.

## 🚀 **Quick Setup**

### Backend Configuration (Already Done)
- ✅ CORS is configured to allow frontend requests
- ✅ Backend runs on `http://localhost:8080`
- ✅ All endpoints are accessible without authentication (for development)

### Frontend Setup

#### **Option 1: React Frontend**
```bash
# Create React app in a separate folder
npx create-react-app mis-frontend
cd mis-frontend

# Install axios for API calls
npm install axios

# Start the frontend
npm start
```

#### **Option 2: Angular Frontend**
```bash
# Create Angular app
ng new mis-frontend
cd mis-frontend

# Start the frontend
ng serve
```

#### **Option 3: Vue.js Frontend**
```bash
# Create Vue app
npm create vue@latest mis-frontend
cd mis-frontend
npm install

# Start the frontend
npm run dev
```

## 🔧 **API Configuration**

### Base URL Configuration
Create an API configuration file in your frontend:

**For React (`src/config/api.js`):**
```javascript
export const API_BASE_URL = 'http://localhost:8080/api';

export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  ME: '/auth/me',
  
  // Courses
  COURSES: '/courses',
  COURSE_BY_ID: (id) => `/courses/${id}`,
  
  // Students
  STUDENTS: '/students',
  STUDENT_BY_ID: (id) => `/students/${id}`,
  STUDENT_ENROLLMENTS: (id) => `/students/${id}/enrollments`,
  STUDENT_GRADES: (id) => `/students/${id}/grades`,
  
  // Admin
  ADMIN_STUDENTS: '/admin/students',
  ADMIN_COURSES: '/admin/courses',
  ADMIN_GRADE: (enrollmentId) => `/admin/enrollments/${enrollmentId}/grade`,
};
```

**For Angular (`src/app/services/api.service.ts`):**
```typescript
export class ApiService {
  private baseUrl = 'http://localhost:8080/api';
  
  // API endpoints
  readonly LOGIN = '/auth/login';
  readonly COURSES = '/courses';
  readonly STUDENTS = '/students';
  // ... add more endpoints
}
```

## 📡 **API Service Examples**

### React Example (`src/services/api.js`)
```javascript
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Course API
export const courseAPI = {
  getAllCourses: () => api.get('/courses'),
  getCourseById: (id) => api.get(`/courses/${id}`),
};

// Student API
export const studentAPI = {
  getStudentById: (id) => api.get(`/students/${id}`),
  updateStudent: (id, data) => api.put(`/students/${id}`, data),
  getEnrollments: (id) => api.get(`/students/${id}/enrollments`),
  enrollInCourse: (studentId, courseId) => 
    api.post(`/students/${studentId}/enrollments?courseId=${courseId}`),
  getGrades: (id) => api.get(`/students/${id}/grades`),
};

// Admin API
export const adminAPI = {
  createStudent: (data) => api.post('/admin/students', data),
  createCourse: (data) => api.post('/admin/courses', data),
  assignGrade: (enrollmentId, grade) => 
    api.put(`/admin/enrollments/${enrollmentId}/grade?grade=${grade}`),
};

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (studentData) => api.post('/auth/register', studentData),
};
```

### Angular Example (`src/app/services/api.service.ts`)
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // Course methods
  getCourses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/courses`);
  }

  getCourse(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/courses/${id}`);
  }

  // Student methods
  getStudent(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/students/${id}`);
  }

  updateStudent(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/students/${id}`, data);
  }

  getEnrollments(studentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/students/${studentId}/enrollments`);
  }

  enrollInCourse(studentId: number, courseId: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/students/${studentId}/enrollments?courseId=${courseId}`, {});
  }

  // Admin methods
  createStudent(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/admin/students`, data);
  }

  createCourse(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/admin/courses`, data);
  }

  assignGrade(enrollmentId: number, grade: string): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/admin/enrollments/${enrollmentId}/grade?grade=${grade}`, {});
  }
}
```

## 🎯 **Usage Examples**

### React Component Example
```jsx
import React, { useState, useEffect } from 'react';
import { courseAPI, studentAPI } from '../services/api';

function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await courseAPI.getAllCourses();
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Available Courses</h2>
      {courses.map(course => (
        <div key={course.id}>
          <h3>{course.courseTitle}</h3>
          <p>Code: {course.courseCode}</p>
          <p>Credits: {course.credits}</p>
        </div>
      ))}
    </div>
  );
}

export default CourseList;
```

### Angular Component Example
```typescript
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-course-list',
  template: `
    <div>
      <h2>Available Courses</h2>
      <div *ngFor="let course of courses">
        <h3>{{ course.courseTitle }}</h3>
        <p>Code: {{ course.courseCode }}</p>
        <p>Credits: {{ course.credits }}</p>
      </div>
    </div>
  `
})
export class CourseListComponent implements OnInit {
  courses: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
      },
      error: (error) => {
        console.error('Error fetching courses:', error);
      }
    });
  }
}
```

## 🔐 **Authentication Integration**

### JWT Token Handling
```javascript
// Add to your API service
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## 🚀 **Development Workflow**

### 1. Start Both Applications
```bash
# Terminal 1: Start Backend
cd backEnd
./mvnw spring-boot:run

# Terminal 2: Start Frontend
cd mis-frontend
npm start  # or ng serve for Angular
```

### 2. Test Integration
```javascript
// Test API connection
fetch('http://localhost:8080/api/courses')
  .then(response => response.json())
  .then(data => console.log('Courses:', data))
  .catch(error => console.error('Error:', error));
```

## 📁 **Project Structure Options**

### Option 1: Separate Folders (Recommended for Development)
```
/your-project/
├── backEnd/           # Your current Spring Boot app
│   ├── src/
│   ├── pom.xml
│   └── ...
└── frontend/          # Your frontend app
    ├── src/
    ├── package.json
    └── ...
```

### Option 2: Monorepo Structure
```
/your-project/
├── backend/           # Spring Boot app
├── frontend/          # Frontend app
├── shared/            # Shared types/utilities
└── package.json       # Root package.json for scripts
```

## 🔧 **Environment Configuration**

### Frontend Environment Variables
Create `.env` files in your frontend:

**`.env.development`:**
```
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_ENVIRONMENT=development
```

**`.env.production`:**
```
REACT_APP_API_URL=https://your-production-api.com/api
REACT_APP_ENVIRONMENT=production
```

### Usage in Code
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
```

## 🐛 **Common Issues & Solutions**

### CORS Issues
- ✅ Backend CORS is already configured
- If you still get CORS errors, check that your frontend URL is in the allowed origins

### Port Conflicts
- Backend: `http://localhost:8080`
- React: `http://localhost:3000`
- Angular: `http://localhost:4200`
- Vue: `http://localhost:5173`

### Network Issues
```bash
# Test backend connectivity
curl http://localhost:8080/api/courses

# Test from frontend
fetch('http://localhost:8080/api/courses')
  .then(res => res.json())
  .then(data => console.log(data));
```

## 📚 **Next Steps**

1. **Choose your frontend framework** (React, Angular, Vue, etc.)
2. **Set up the project structure** as shown above
3. **Configure API services** using the examples provided
4. **Test the integration** with the backend
5. **Build your UI components** using the API data

## 🎯 **Quick Test**

Once you have your frontend set up, test the integration:

```javascript
// Test in browser console
fetch('http://localhost:8080/api/courses')
  .then(response => response.json())
  .then(data => {
    console.log('✅ Backend connection successful!');
    console.log('Courses:', data);
  })
  .catch(error => {
    console.error('❌ Backend connection failed:', error);
  });
```

Your backend is now ready to work with any frontend framework! 🚀 