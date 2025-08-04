import axios from 'axios';

// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
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
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  ME: '/auth/me',
  
  // Courses
  COURSES: '/courses',
  COURSE_BY_ID: (id: number) => `/courses/${id}`,
  
  // Students
  STUDENTS: '/students',
  STUDENT_BY_ID: (id: number) => `/students/${id}`,
  STUDENT_ENROLLMENTS: (id: number) => `/students/${id}/enrollments`,
  STUDENT_GRADES: (id: number) => `/students/${id}/grades`,
  
  // Admin
  ADMIN_STUDENTS: '/admin/students',
  ADMIN_COURSES: '/admin/courses',
  ADMIN_GRADE: (enrollmentId: number) => `/admin/enrollments/${enrollmentId}/grade`,
};

// Type definitions
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  role: string;
  message: string;
}

export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  admissionNumber: string;
  dateOfBirth: string;
  department: string;
}

export interface Course {
  id: number;
  courseCode: string;
  courseTitle: string;
  credits: number;
  description: string;
  semester: string;
}

export interface Enrollment {
  id: number;
  studentId: number;
  courseId: number;
  studentName: string;
  courseTitle: string;
  enrollmentDate: string;
  grade: string | null;
}

// API Services
export const authAPI = {
  login: (credentials: LoginRequest) => 
    api.post<LoginResponse>(API_ENDPOINTS.LOGIN, credentials),
  
  register: (studentData: Omit<Student, 'id'>) => 
    api.post<Student>(API_ENDPOINTS.REGISTER, studentData),
  
  getCurrentUser: () => 
    api.get(API_ENDPOINTS.ME),
};

export const courseAPI = {
  getAllCourses: () => 
    api.get<Course[]>(API_ENDPOINTS.COURSES),
  
  getCourseById: (id: number) => 
    api.get<Course>(API_ENDPOINTS.COURSE_BY_ID(id)),
  
  createCourse: (courseData: Omit<Course, 'id'>) => 
    api.post<Course>(API_ENDPOINTS.ADMIN_COURSES, courseData),
  
  updateCourse: (id: number, courseData: Partial<Course>) => 
    api.put<Course>(API_ENDPOINTS.ADMIN_COURSES + `/${id}`, courseData),
};

export const studentAPI = {
  getStudentById: (id: number) => 
    api.get<Student>(API_ENDPOINTS.STUDENT_BY_ID(id)),
  
  updateStudent: (id: number, studentData: Partial<Student>) => 
    api.put<Student>(API_ENDPOINTS.STUDENT_BY_ID(id), studentData),
  
  getEnrollments: (id: number) => 
    api.get<Enrollment[]>(API_ENDPOINTS.STUDENT_ENROLLMENTS(id)),
  
  enrollInCourse: (studentId: number, courseId: number) => 
    api.post<Enrollment>(API_ENDPOINTS.STUDENT_ENROLLMENTS(studentId), null, {
      params: { courseId }
    }),
  
  dropCourse: (studentId: number, enrollmentId: number) => 
    api.delete(API_ENDPOINTS.STUDENT_ENROLLMENTS(studentId) + `/${enrollmentId}`),
  
  getGrades: (id: number) => 
    api.get<Enrollment[]>(API_ENDPOINTS.STUDENT_GRADES(id)),
  
  createStudent: (studentData: Omit<Student, 'id'>) => 
    api.post<Student>(API_ENDPOINTS.ADMIN_STUDENTS, studentData),
  
  updateStudentAdmin: (id: number, studentData: Partial<Student>) => 
    api.put<Student>(API_ENDPOINTS.ADMIN_STUDENTS + `/${id}`, studentData),
  
  assignGrade: (enrollmentId: number, grade: string) => 
    api.put(API_ENDPOINTS.ADMIN_GRADE(enrollmentId), null, {
      params: { grade }
    }),
}; 