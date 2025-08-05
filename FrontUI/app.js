// API Configuration
const API_BASE_URL = 'http://localhost:8080/api';

// Global state
let currentUser = null;
let authToken = null;

// API Functions
const api = {
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        if (authToken) {
            config.headers.Authorization = `Bearer ${authToken}`;
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
    },

    // Authentication
    async login(credentials) {
        return await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    },

    async register(studentData) {
        return await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(studentData)
        });
    },

    async getCurrentUser() {
        return await this.request('/auth/me');
    },

    // Courses
    async getCourses() {
        return await this.request('/courses');
    },

    async getCourse(id) {
        return await this.request(`/courses/${id}`);
    },

    async createCourse(courseData) {
        return await this.request('/admin/courses', {
            method: 'POST',
            body: JSON.stringify(courseData)
        });
    },

    async updateCourse(id, courseData) {
        return await this.request(`/admin/courses/${id}`, {
            method: 'PUT',
            body: JSON.stringify(courseData)
        });
    },

    async deleteCourse(id) {
        return await this.request(`/admin/courses/${id}`, {
            method: 'DELETE'
        });
    },

    // Students
    async getStudents() {
        return await this.request('/students');
    },

    async getStudent(id) {
        return await this.request(`/students/${id}`);
    },

    async createStudent(studentData) {
        return await this.request('/admin/students', {
            method: 'POST',
            body: JSON.stringify(studentData)
        });
    },

    async updateStudent(id, studentData) {
        return await this.request(`/admin/students/${id}`, {
            method: 'PUT',
            body: JSON.stringify(studentData)
        });
    },

    async deleteStudent(id) {
        return await this.request(`/admin/students/${id}`, {
            method: 'DELETE'
        });
    },

    // Enrollments
    async getEnrollments(studentId) {
        return await this.request(`/students/${studentId}/enrollments`);
    },

    async enrollStudent(studentId, courseId) {
        return await this.request(`/students/${studentId}/enrollments?courseId=${courseId}`, {
            method: 'POST'
        });
    },

    async dropEnrollment(studentId, enrollmentId) {
        return await this.request(`/students/${studentId}/enrollments/${enrollmentId}`, {
            method: 'DELETE'
        });
    },

    // Grades
    async getGrades(studentId) {
        return await this.request(`/students/${studentId}/grades`);
    },

    async assignGrade(enrollmentId, grade) {
        return await this.request(`/admin/enrollments/${enrollmentId}/grade?grade=${grade}`, {
            method: 'PUT'
        });
    }
};

// UI Functions
const ui = {
    showLoading() {
        document.getElementById('loadingOverlay').classList.remove('hidden');
    },

    hideLoading() {
        document.getElementById('loadingOverlay').classList.add('hidden');
    },

    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast toast-${type} slide-in-right`;
        toast.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} mr-2"></i>
                <span>${message}</span>
            </div>
        `;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.remove('slide-in-right');
            toast.classList.add('slide-in-left');
            setTimeout(() => {
                container.removeChild(toast);
            }, 300);
        }, 3000);
    },

    showModal(modalId) {
        document.getElementById(modalId).classList.remove('hidden');
    },

    hideModal(modalId) {
        document.getElementById(modalId).classList.add('hidden');
    },

    showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.add('hidden');
        });
        
        // Show selected section
        document.getElementById(sectionId).classList.remove('hidden');
        
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Load section data
        this.loadSectionData(sectionId);
    },

    async loadSectionData(sectionId) {
        switch (sectionId) {
            case 'dashboard':
                await this.loadDashboard();
                break;
            case 'courses':
                await this.loadCourses();
                break;
            case 'students':
                await this.loadStudents();
                break;
            case 'admin':
                await this.loadAdmin();
                break;
        }
    },

    async loadDashboard() {
        try {
            ui.showLoading();
            
            // Load statistics
            const [students, courses] = await Promise.all([
                api.getStudents().catch(() => []),
                api.getCourses().catch(() => [])
            ]);

            document.getElementById('totalStudents').textContent = students.length;
            document.getElementById('totalCourses').textContent = courses.length;
            document.getElementById('totalEnrollments').textContent = '0'; // TODO: Add enrollment count
            document.getElementById('activeUsers').textContent = '1'; // TODO: Add active users count

            // Load recent activity
            const activityContainer = document.getElementById('recentActivity');
            activityContainer.innerHTML = `
                <div class="space-y-3">
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div class="flex items-center">
                            <i class="fas fa-user-plus text-green-600 mr-3"></i>
                            <div>
                                <p class="text-sm font-medium">New student registered</p>
                                <p class="text-xs text-gray-500">2 minutes ago</p>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div class="flex items-center">
                            <i class="fas fa-book text-blue-600 mr-3"></i>
                            <div>
                                <p class="text-sm font-medium">New course added</p>
                                <p class="text-xs text-gray-500">5 minutes ago</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;

        } catch (error) {
            ui.showToast('Failed to load dashboard data', 'error');
        } finally {
            ui.hideLoading();
        }
    },

    async loadCourses() {
        try {
            ui.showLoading();
            
            const courses = await api.getCourses();
            const container = document.getElementById('coursesList');
            
            if (courses.length === 0) {
                container.innerHTML = `
                    <div class="col-span-full text-center py-12">
                        <i class="fas fa-book text-gray-400 text-4xl mb-4"></i>
                        <h3 class="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
                        <p class="text-gray-500">No courses are currently available.</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = courses.map(course => `
                <div class="card">
                    <div class="card-header">
                        <div>
                            <h3 class="card-title">${course.courseTitle}</h3>
                            <p class="card-subtitle">${course.courseCode}</p>
                        </div>
                        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <i class="fas fa-book text-blue-600"></i>
                        </div>
                    </div>
                    <p class="text-gray-600 mb-4">${course.description}</p>
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex space-x-2">
                            <span class="badge badge-success">${course.credits} Credits</span>
                            <span class="badge badge-info">${course.semester}</span>
                        </div>
                    </div>
                    <div class="flex space-x-2">
                        <button onclick="ui.viewCourse(${course.id})" class="btn-outline flex-1">
                            <i class="fas fa-eye mr-2"></i>View
                        </button>
                        <button onclick="ui.editCourse(${course.id})" class="btn-primary flex-1">
                            <i class="fas fa-edit mr-2"></i>Edit
                        </button>
                    </div>
                </div>
            `).join('');

        } catch (error) {
            ui.showToast('Failed to load courses', 'error');
        } finally {
            ui.hideLoading();
        }
    },

    async loadStudents() {
        try {
            ui.showLoading();
            
            const students = await api.getStudents();
            const container = document.getElementById('studentsList');
            
            if (students.length === 0) {
                container.innerHTML = `
                    <div class="text-center py-12">
                        <i class="fas fa-users text-gray-400 text-4xl mb-4"></i>
                        <h3 class="text-lg font-medium text-gray-900 mb-2">No students found</h3>
                        <p class="text-gray-500">No students are currently registered.</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = students.map(student => `
                <div class="card">
                    <div class="card-header">
                        <div>
                            <h3 class="card-title">${student.firstName} ${student.lastName}</h3>
                            <p class="card-subtitle">${student.admissionNumber}</p>
                        </div>
                        <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <i class="fas fa-user text-green-600"></i>
                        </div>
                    </div>
                    <div class="space-y-2 mb-4">
                        <p class="text-sm text-gray-600">
                            <i class="fas fa-envelope mr-2"></i>${student.email}
                        </p>
                        <p class="text-sm text-gray-600">
                            <i class="fas fa-building mr-2"></i>${student.department}
                        </p>
                        <p class="text-sm text-gray-600">
                            <i class="fas fa-calendar mr-2"></i>${student.dateOfBirth}
                        </p>
                    </div>
                    <div class="flex space-x-2">
                        <button onclick="ui.viewStudent(${student.id})" class="btn-outline flex-1">
                            <i class="fas fa-eye mr-2"></i>View
                        </button>
                        <button onclick="ui.editStudent(${student.id})" class="btn-primary flex-1">
                            <i class="fas fa-edit mr-2"></i>Edit
                        </button>
                    </div>
                </div>
            `).join('');

        } catch (error) {
            ui.showToast('Failed to load students', 'error');
        } finally {
            ui.hideLoading();
        }
    },

    async loadAdmin() {
        try {
            ui.showLoading();
            
            const [students, courses] = await Promise.all([
                api.getStudents().catch(() => []),
                api.getCourses().catch(() => [])
            ]);

            document.getElementById('adminTotalStudents').textContent = students.length;
            document.getElementById('adminTotalCourses').textContent = courses.length;
            document.getElementById('adminTotalEnrollments').textContent = '0'; // TODO: Add enrollment count

        } catch (error) {
            ui.showToast('Failed to load admin data', 'error');
        } finally {
            ui.hideLoading();
        }
    },

    viewCourse(id) {
        // TODO: Implement course detail view
        ui.showToast('Course detail view coming soon', 'info');
    },

    editCourse(id) {
        // TODO: Implement course edit
        ui.showToast('Course edit coming soon', 'info');
    },

    viewStudent(id) {
        // TODO: Implement student detail view
        ui.showToast('Student detail view coming soon', 'info');
    },

    editStudent(id) {
        // TODO: Implement student edit
        ui.showToast('Student edit coming soon', 'info');
    }
};

// Authentication Functions
const auth = {
    async login(username, password) {
        try {
            ui.showLoading();
            
            const response = await api.login({ username, password });
            
            authToken = response.token;
            currentUser = {
                username: response.username,
                role: response.role
            };
            
            localStorage.setItem('token', authToken);
            localStorage.setItem('user', JSON.stringify(currentUser));
            
            ui.updateAuthUI();
            ui.hideModal('loginModal');
            ui.showToast('Login successful!', 'success');
            
            // Redirect based on role
            if (currentUser.role === 'ADMIN') {
                ui.showSection('admin');
            } else {
                ui.showSection('dashboard');
            }
            
        } catch (error) {
            ui.showToast(error.message || 'Login failed', 'error');
        } finally {
            ui.hideLoading();
        }
    },

    async register(studentData) {
        try {
            ui.showLoading();
            
            await api.register(studentData);
            
            ui.hideModal('registerModal');
            ui.showToast('Registration successful! You can now login with your admission number.', 'success');
            
        } catch (error) {
            ui.showToast(error.message || 'Registration failed', 'error');
        } finally {
            ui.hideLoading();
        }
    },

    logout() {
        authToken = null;
        currentUser = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        ui.updateAuthUI();
        ui.showSection('dashboard');
        ui.showToast('Logged out successfully', 'info');
    },

    checkAuth() {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        
        if (token && user) {
            authToken = token;
            currentUser = JSON.parse(user);
            ui.updateAuthUI();
        }
    }
};

// Form Handlers
const forms = {
    handleLogin(event) {
        event.preventDefault();
        
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        
        auth.login(username, password);
    },

    handleRegister(event) {
        event.preventDefault();
        
        const studentData = {
            firstName: document.getElementById('registerFirstName').value,
            lastName: document.getElementById('registerLastName').value,
            email: document.getElementById('registerEmail').value,
            admissionNumber: document.getElementById('registerAdmissionNumber').value,
            dateOfBirth: document.getElementById('registerDateOfBirth').value,
            department: document.getElementById('registerDepartment').value
        };
        
        auth.register(studentData);
    },

    handleAddCourse(event) {
        event.preventDefault();
        
        const courseData = {
            courseCode: document.getElementById('courseCode').value,
            courseTitle: document.getElementById('courseTitle').value,
            credits: parseInt(document.getElementById('courseCredits').value),
            semester: document.getElementById('courseSemester').value,
            description: document.getElementById('courseDescription').value
        };
        
        api.createCourse(courseData)
            .then(() => {
                ui.hideModal('addCourseModal');
                ui.showToast('Course added successfully', 'success');
                ui.loadCourses();
            })
            .catch(error => {
                ui.showToast(error.message || 'Failed to add course', 'error');
            });
    },

    handleAddStudent(event) {
        event.preventDefault();
        
        const studentData = {
            firstName: document.getElementById('studentFirstName').value,
            lastName: document.getElementById('studentLastName').value,
            email: document.getElementById('studentEmail').value,
            admissionNumber: document.getElementById('studentAdmissionNumber').value,
            dateOfBirth: document.getElementById('studentDateOfBirth').value,
            department: document.getElementById('studentDepartment').value
        };
        
        api.createStudent(studentData)
            .then(() => {
                ui.hideModal('addStudentModal');
                ui.showToast('Student added successfully', 'success');
                ui.loadStudents();
            })
            .catch(error => {
                ui.showToast(error.message || 'Failed to add student', 'error');
            });
    }
};

// Navigation Functions
const navigation = {
    showSection(sectionId) {
        ui.showSection(sectionId);
    },

    toggleMobileMenu() {
        const menu = document.getElementById('mobileMenu');
        menu.classList.toggle('hidden');
    },

    showLoginModal() {
        ui.showModal('loginModal');
    },

    showRegisterModal() {
        ui.showModal('registerModal');
    },

    showAddCourseModal() {
        ui.showModal('addCourseModal');
    },

    showAddStudentModal() {
        ui.showModal('addStudentModal');
    },

    hideModal(modalId) {
        ui.hideModal(modalId);
    },

    logout() {
        auth.logout();
    }
};

// Utility Functions
const utils = {
    refreshData() {
        ui.loadSectionData(document.querySelector('.section:not(.hidden)').id);
        ui.showToast('Data refreshed', 'success');
    },

    exportData() {
        // TODO: Implement data export
        ui.showToast('Export functionality coming soon', 'info');
    }
};

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize
    auth.checkAuth();
    ui.showSection('dashboard');
    
    // Form event listeners
    document.getElementById('loginForm').addEventListener('submit', forms.handleLogin);
    document.getElementById('registerForm').addEventListener('submit', forms.handleRegister);
    document.getElementById('addCourseForm').addEventListener('submit', forms.handleAddCourse);
    document.getElementById('addStudentForm').addEventListener('submit', forms.handleAddStudent);
    
    // Search functionality
    document.getElementById('courseSearch').addEventListener('input', function(e) {
        // TODO: Implement course search
    });
    
    document.getElementById('studentSearch').addEventListener('input', function(e) {
        // TODO: Implement student search
    });
    
    // Modal backdrop clicks
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    });
});

// Global functions for HTML onclick handlers
window.showSection = navigation.showSection;
window.toggleMobileMenu = navigation.toggleMobileMenu;
window.showLoginModal = navigation.showLoginModal;
window.showRegisterModal = navigation.showRegisterModal;
window.showAddCourseModal = navigation.showAddCourseModal;
window.showAddStudentModal = navigation.showAddStudentModal;
window.hideModal = navigation.hideModal;
window.logout = navigation.logout;
window.refreshData = utils.refreshData;
window.exportData = utils.exportData;

// Extend ui object with updateAuthUI method
ui.updateAuthUI = function() {
    const userMenu = document.getElementById('userMenu');
    const authButtons = document.getElementById('authButtons');
    const mobileUserMenu = document.getElementById('mobileUserMenu');
    const mobileAuthButtons = document.getElementById('mobileAuthButtons');
    
    if (currentUser) {
        userMenu.classList.remove('hidden');
        authButtons.classList.add('hidden');
        mobileUserMenu.classList.remove('hidden');
        mobileAuthButtons.classList.add('hidden');
    } else {
        userMenu.classList.add('hidden');
        authButtons.classList.remove('hidden');
        mobileUserMenu.classList.add('hidden');
        mobileAuthButtons.classList.remove('hidden');
    }
}; 