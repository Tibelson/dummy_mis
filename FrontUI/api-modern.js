// Modern API Integration for MIS Web
class APIClient {
    constructor() {
        this.baseURL = 'http://localhost:8080/api';
        this.authToken = localStorage.getItem('authToken');
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        if (this.authToken) {
            config.headers.Authorization = `Bearer ${this.authToken}`;
        }

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Authentication
    async login(credentials) {
        const response = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
        
        if (response.token) {
            this.authToken = response.token;
            localStorage.setItem('authToken', response.token);
        }
        
        return response;
    }

    async register(userData) {
        return await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    async getCurrentUser() {
        return await this.request('/auth/me');
    }

    // Courses
    async getCourses() {
        return await this.request('/courses');
    }

    async getCourse(id) {
        return await this.request(`/courses/${id}`);
    }

    async createCourse(courseData) {
        return await this.request('/admin/courses', {
            method: 'POST',
            body: JSON.stringify(courseData)
        });
    }

    async updateCourse(id, courseData) {
        return await this.request(`/admin/courses/${id}`, {
            method: 'PUT',
            body: JSON.stringify(courseData)
        });
    }

    async deleteCourse(id) {
        return await this.request(`/admin/courses/${id}`, {
            method: 'DELETE'
        });
    }

    // Students
    async getStudents() {
        return await this.request('/students');
    }

    async getStudent(id) {
        return await this.request(`/students/${id}`);
    }

    async createStudent(studentData) {
        return await this.request('/students', {
            method: 'POST',
            body: JSON.stringify(studentData)
        });
    }

    async updateStudent(id, studentData) {
        return await this.request(`/students/${id}`, {
            method: 'PUT',
            body: JSON.stringify(studentData)
        });
    }

    async deleteStudent(id) {
        return await this.request(`/students/${id}`, {
            method: 'DELETE'
        });
    }

    // Lecturers
    async getLecturers() {
        return await this.request('/lecturers');
    }

    async getLecturer(id) {
        return await this.request(`/lecturers/${id}`);
    }

    async createLecturer(lecturerData) {
        return await this.request('/lecturers', {
            method: 'POST',
            body: JSON.stringify(lecturerData)
        });
    }

    async updateLecturer(id, lecturerData) {
        return await this.request(`/lecturers/${id}`, {
            method: 'PUT',
            body: JSON.stringify(lecturerData)
        });
    }

    async deleteLecturer(id) {
        return await this.request(`/lecturers/${id}`, {
            method: 'DELETE'
        });
    }

    // Enrollments
    async getEnrollments(studentId) {
        return await this.request(`/students/${studentId}/enrollments`);
    }

    async enrollStudent(studentId, courseId) {
        return await this.request(`/students/${studentId}/enroll/${courseId}`, {
            method: 'POST'
        });
    }

    async dropEnrollment(studentId, enrollmentId) {
        return await this.request(`/students/${studentId}/enrollments/${enrollmentId}`, {
            method: 'DELETE'
        });
    }

    // Grades
    async getGrades(studentId) {
        return await this.request(`/students/${studentId}/grades`);
    }

    async assignGrade(enrollmentId, grade) {
        return await this.request(`/enrollments/${enrollmentId}/grade`, {
            method: 'PUT',
            body: JSON.stringify({ grade })
        });
    }

    // Lecturer specific
    async getLecturerCourses(lecturerId) {
        return await this.request(`/lecturers/${lecturerId}/courses`);
    }

    async getCourseEnrollments(lecturerId, courseId) {
        return await this.request(`/lecturers/${lecturerId}/courses/${courseId}/enrollments`);
    }

    async assignLecturerToCourse(courseId, lecturerId) {
        return await this.request(`/courses/${courseId}/assign-lecturer/${lecturerId}`, {
            method: 'PUT'
        });
    }
}

// Create global API instance
window.api = new APIClient();
