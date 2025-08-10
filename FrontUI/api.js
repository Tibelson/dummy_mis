/* Shared API client */
const API_BASE_URL = 'http://localhost:8080/api';

const api = {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('token');

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }
      // Some endpoints may return no content
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) return null;
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Auth
  async login(credentials) {
    return await this.request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) });
  },
  async register(studentData) {
    return await this.request('/auth/register', { method: 'POST', body: JSON.stringify(studentData) });
  },
  async getCurrentUser() {
    return await this.request('/auth/me', { method: 'GET' });
  },

  // Courses
  async getCourses() { return await this.request('/courses', { method: 'GET' }); },
  async getCourse(id) { return await this.request(`/courses/${id}`, { method: 'GET' }); },
  async createCourse(courseData) { return await this.request('/admin/courses', { method: 'POST', body: JSON.stringify(courseData) }); },
  async updateCourse(id, courseData) { return await this.request(`/admin/courses/${id}`, { method: 'PUT', body: JSON.stringify(courseData) }); },
  async deleteCourse(id) { return await this.request(`/admin/courses/${id}`, { method: 'DELETE' }); },
  async getDashboardStats() { return await this.request('/admin/dashboard/stats', { method: 'GET' }); },

  // Students
  async getStudents() { return await this.request('/students', { method: 'GET' }); },
  async getStudent(id) { return await this.request(`/students/${id}`, { method: 'GET' }); },
  async createStudent(studentData) { return await this.request('/admin/students', { method: 'POST', body: JSON.stringify(studentData) }); },
  async updateStudent(id, studentData) { return await this.request(`/admin/students/${id}`, { method: 'PUT', body: JSON.stringify(studentData) }); },
  async deleteStudent(id) { return await this.request(`/admin/students/${id}`, { method: 'DELETE' }); },

  // Lecturers
  async getLecturers() { return await this.request('/lecturers', { method: 'GET' }); },
  async getLecturer(id) { return await this.request(`/lecturers/${id}`, { method: 'GET' }); },
  async createLecturer(lecturerData) { return await this.request('/admin/lecturers', { method: 'POST', body: JSON.stringify(lecturerData) }); },
  async updateLecturer(id, lecturerData) { return await this.request(`/admin/lecturers/${id}`, { method: 'PUT', body: JSON.stringify(lecturerData) }); },
  async deleteLecturer(id) { return await this.request(`/admin/lecturers/${id}`, { method: 'DELETE' }); },
  async getLecturerCourses(lecturerId) { return await this.request(`/lecturers/${lecturerId}/courses`, { method: 'GET' }); },
  async assignLecturerToCourse(courseId, lecturerId) { return await this.request(`/courses/${courseId}/assign-lecturer/${lecturerId}`, { method: 'PUT' }); },
  async assignLecturerToCourseAdmin(courseId, lecturerId) { return await this.request(`/admin/courses/${courseId}/assign-lecturer/${lecturerId}`, { method: 'PUT' }); },

  // Enrollments
  async getEnrollment(enrollmentId) { return await this.request(`/enrollments/${enrollmentId}`, { method: 'GET' }); },
  async getEnrollments(studentId) { return await this.request(`/students/${studentId}/enrollments`, { method: 'GET' }); },
  async enrollStudent(studentId, courseId) { return await this.request(`/students/${studentId}/enrollments?courseId=${courseId}`, { method: 'POST' }); },
  async dropEnrollment(studentId, enrollmentId) { return await this.request(`/students/${studentId}/enrollments/${enrollmentId}`, { method: 'DELETE' }); },

  // Grades (admin endpoint fallback)
  async assignGradeAdmin(enrollmentId, grade) { return await this.request(`/admin/enrollments/${enrollmentId}/grade?grade=${grade}`, { method: 'PUT' }); },
  async assignGrade(enrollmentId, grade) { return await this.request(`/admin/enrollments/${enrollmentId}/grade?grade=${grade}`, { method: 'PUT' }); },
}; 