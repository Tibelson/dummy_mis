// API Configuration
const API_BASE_URL = 'http://localhost:8080/api';

// Global state
let currentUser = null;
let currentUserRole = localStorage.getItem('userRole') || null;
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
        return await this.request('/auth/me', {
            method: 'GET'
        });
    },

    // Courses
    async getCourses() {
        return await this.request('/courses', {
            method: 'GET',
        });
    },

    async getCourse(id) {
        return await this.request(`/courses/${id}`, {
            method: 'GET'
        });
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
        return await this.request('/students', {
            method: 'GET'
        });
    },

    // Lecturers
    async getLecturers() {
        return await this.request('/lecturers', {
            method: 'GET'
        });
    },

    async getLecturer(id) {
        return await this.request(`/lecturers/${id}`, {
            method: 'GET'
        });
    },

    async createLecturer(lecturerData) {
        return await this.request('/lecturers', {
            method: 'POST',
            body: JSON.stringify(lecturerData)
        });
    },

    async updateLecturer(id, lecturerData) {
        return await this.request(`/lecturers/${id}`, {
            method: 'PUT',
            body: JSON.stringify(lecturerData)
        });
    },

    async deleteLecturer(id) {
        return await this.request(`/lecturers/${id}`, {
            method: 'DELETE'
        });
    },

    async getLecturerCourses(lecturerId) {
        return await this.request(`/lecturers/${lecturerId}/courses`, {
            method: 'GET'
        });
    },

    async getCourseEnrollments(lecturerId, courseId) {
        return await this.request(`/lecturers/${lecturerId}/courses/${courseId}/enrollments`, {
            method: 'GET'
        });
    },

    async assignGrade(lecturerId, enrollmentId, grade) {
        return await this.request(`/lecturers/${lecturerId}/enrollments/${enrollmentId}/grade`, {
            method: 'PUT',
            body: JSON.stringify({ grade })
        });
    },

    async assignLecturerToCourse(courseId, lecturerId) {
        return await this.request(`/courses/${courseId}/assign-lecturer/${lecturerId}`, {
            method: 'PUT'
        });
    },

    async getStudent(id) {
        return await this.request(`/students/${id}`, {
            method: 'GET'
        });
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

    // Admin Dashboard
    async getDashboardStats() {
        return await this.request('/admin/dashboard/stats', {
            method: 'GET'
        });
    },

    // Enrollments & Academic Management
    async getEnrollments(studentId) {
        return await this.request(`/students/${studentId}/enrollments`, {
            method: 'GET'
        });
    },

    async enrollStudent(studentId, courseId) {
        return await this.request(`/admin/enrollments?studentId=${studentId}&courseId=${courseId}`, {
            method: 'POST'
        });
    },

    async removeEnrollment(enrollmentId) {
        return await this.request(`/admin/enrollments/${enrollmentId}`, {
            method: 'DELETE'
        });
    },

    async assignGradeAdmin(enrollmentId, grade) {
        return await this.request(`/admin/enrollments/${enrollmentId}/grade?grade=${grade}`, {
            method: 'PUT'
        });
    },

    async assignLecturerToCourseAdmin(courseId, lecturerId) {
        return await this.request(`/admin/courses/${courseId}/assign-lecturer/${lecturerId}`, {
            method: 'PUT'
        });
    },

    async dropEnrollment(studentId, enrollmentId) {
        return await this.request(`/students/${studentId}/enrollments/${enrollmentId}`, {
            method: 'DELETE'
        });
    },

    // Grades
    async getGrades(studentId) {
        return await this.request(`/students/${studentId}/grades`, {
            method: 'GET'
        });
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
            toast.classList.add('slide-out-right'); // Use a slide-out class
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

        // Update navigation based on user role
        ui.updateNavigation(sectionId);

        // Load section data
        this.loadSectionData(sectionId);
    },

    updateNavigation(activeSection) {
        // Hide all navigation sections first
        document.getElementById('roleSelectionNav').classList.add('hidden');
        document.getElementById('studentNavigation').classList.add('hidden');
        document.getElementById('lecturerNavigation').classList.add('hidden');
        document.getElementById('adminNavigation').classList.add('hidden');

        // Show appropriate navigation based on user role
        const userRole = currentUserRole || currentUser?.role || null;
        
        if (userRole === 'admin' || userRole === 'ADMIN') {
            // Show admin navigation
            document.getElementById('adminNavigation').classList.remove('hidden');
        } else if (userRole === 'student') {
            // Show student navigation
            document.getElementById('studentNavigation').classList.remove('hidden');
        } else if (userRole === 'lecturer') {
            // Show lecturer navigation
            document.getElementById('lecturerNavigation').classList.remove('hidden');
        } else {
            // Show role selection navigation
            document.getElementById('roleSelectionNav').classList.remove('hidden');
        }

        // Highlight active section
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            const section = link.getAttribute('onclick')?.match(/showSection\('([^']+)'\)/)?.[1];
            if (section === activeSection) {
                link.classList.add('active');
            }
        });
    },

    async loadSectionData(sectionId) {
        switch (sectionId) {
            case 'dashboard':
                await this.loadDashboard();
                break;
            case 'studentDashboard':
                await this.loadStudentDashboard();
                break;
            case 'studentCourses':
                await this.loadStudentCourses();
                break;
            case 'studentGrades':
                await this.loadStudentGrades();
                break;
            case 'lecturerDashboard':
                await this.loadLecturerDashboard();
                break;
            case 'lecturerCourses':
                await this.loadLecturerCourses();
                break;
            case 'lecturerStudents':
                await this.loadLecturerStudents();
                break;
            case 'lecturerGrades':
                await this.loadLecturerGrades();
                break;
            case 'courses':
                await this.loadCourses();
                break;
            case 'students':
                await this.loadStudents();
                break;
            case 'lecturers':
                await this.loadLecturers();
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

    async loadStudentDashboard() {
        try {
            ui.showLoading();

            // Load student-specific data
            const [courses, enrollments] = await Promise.all([
                api.getCourses().catch(() => []),
                api.getEnrollments(currentUser?.id).catch(() => [])
            ]);

            // Update statistics
            document.getElementById('studentEnrolledCourses').textContent = enrollments.length;
            document.getElementById('studentAverageGrade').textContent = 'B+'; // TODO: Calculate actual average
            document.getElementById('studentCreditsEarned').textContent = enrollments.length * 3; // TODO: Calculate actual credits

            // Load enrolled courses
            const enrolledContainer = document.getElementById('studentCoursesList');
            if (enrollments.length === 0) {
                enrolledContainer.innerHTML = `
                    <div class="text-gray-500 text-center py-8">
                        <i class="fas fa-info-circle text-2xl mb-2"></i>
                        <p>No courses enrolled</p>
                    </div>
                `;
            } else {
                enrolledContainer.innerHTML = enrollments.map(enrollment => `
                    <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div class="flex items-center">
                            <i class="fas fa-book text-blue-600 mr-3"></i>
                            <div>
                                <p class="font-medium">${enrollment.course?.courseTitle || 'Course'}</p>
                                <p class="text-sm text-gray-500">${enrollment.course?.courseCode || 'Code'}</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="font-medium">${enrollment.grade || 'Not graded'}</p>
                            <p class="text-sm text-gray-500">${enrollment.course?.credits || 0} credits</p>
                        </div>
                    </div>
                `).join('');
            }

            // Load available courses
            const availableContainer = document.getElementById('studentAvailableCourses');
            const availableCourses = courses.filter(course => 
                !enrollments.some(enrollment => enrollment.courseId === course.id)
            );

            if (availableCourses.length === 0) {
                availableContainer.innerHTML = `
                    <div class="text-gray-500 text-center py-8">
                        <i class="fas fa-info-circle text-2xl mb-2"></i>
                        <p>No available courses</p>
                    </div>
                `;
            } else {
                availableContainer.innerHTML = availableCourses.map(course => `
                    <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div class="flex items-center">
                            <i class="fas fa-book text-green-600 mr-3"></i>
                            <div>
                                <p class="font-medium">${course.courseTitle}</p>
                                <p class="text-sm text-gray-500">${course.courseCode} • ${course.credits} credits</p>
                            </div>
                        </div>
                        <button onclick="enrollInCourse(${course.id})" class="btn-primary text-sm">
                            <i class="fas fa-plus mr-1"></i>Enroll
                        </button>
                    </div>
                `).join('');
            }

        } catch (error) {
            ui.showToast('Failed to load student dashboard', 'error');
        } finally {
            ui.hideLoading();
        }
    },

    async loadStudentCourses() {
        try {
            ui.showLoading();

            const [courses, enrollments] = await Promise.all([
                api.getCourses().catch(() => []),
                api.getEnrollments(currentUser?.id).catch(() => [])
            ]);

            const container = document.getElementById('studentCoursesList');
            const availableCourses = courses.filter(course => 
                !enrollments.some(enrollment => enrollment.courseId === course.id)
            );

            if (availableCourses.length === 0) {
                container.innerHTML = `
                    <div class="col-span-full text-center py-12">
                        <i class="fas fa-book text-gray-400 text-4xl mb-4"></i>
                        <h3 class="text-lg font-medium text-gray-900 mb-2">No available courses</h3>
                        <p class="text-gray-500">All courses are already enrolled or no courses are available.</p>
                    </div>
                `;
            } else {
                container.innerHTML = availableCourses.map(course => `
                    <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
                        <div class="flex items-center justify-between mb-4">
                            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <i class="fas fa-book text-blue-600 text-xl"></i>
                            </div>
                            <button onclick="enrollInCourse(${course.id})" class="btn-primary text-sm">
                                <i class="fas fa-plus mr-1"></i>Enroll
                            </button>
                        </div>
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">${course.courseTitle}</h3>
                        <p class="text-sm text-gray-600 mb-2">${course.courseCode}</p>
                        <p class="text-gray-600 mb-4">${course.description}</p>
                        <div class="flex items-center justify-between text-sm">
                            <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded">${course.credits} Credits</span>
                            <span class="bg-green-100 text-green-800 px-2 py-1 rounded">${course.semester}</span>
                        </div>
                    </div>
                `).join('');
            }

        } catch (error) {
            ui.showToast('Failed to load courses', 'error');
        } finally {
            ui.hideLoading();
        }
    },

    async loadStudentGrades() {
        try {
            ui.showLoading();

            const enrollments = await api.getEnrollments(currentUser?.id).catch(() => []);
            const grades = enrollments.filter(e => e.grade);
            
            // Calculate statistics
            const averageGrade = grades.length > 0 ? 
                grades.reduce((sum, e) => sum + this.getGradePoints(e.grade), 0) / grades.length : 0;
            const completedCourses = grades.length;
            const totalCredits = enrollments.reduce((sum, e) => sum + (e.course?.credits || 0), 0);

            // Update statistics
            document.getElementById('studentOverallGrade').textContent = this.getGradeLetter(averageGrade);
            document.getElementById('studentCompletedCourses').textContent = completedCourses;
            document.getElementById('studentTotalCredits').textContent = totalCredits;

            // Load grades list
            const container = document.getElementById('studentGradesList');
            if (enrollments.length === 0) {
                container.innerHTML = `
                    <div class="text-center py-8">
                        <i class="fas fa-star text-gray-400 text-2xl mb-2"></i>
                        <p class="text-gray-500">No courses enrolled yet</p>
                    </div>
                `;
            } else {
                container.innerHTML = enrollments.map(enrollment => `
                    <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div class="flex items-center">
                            <i class="fas fa-book text-blue-600 mr-3"></i>
                            <div>
                                <p class="font-medium">${enrollment.course?.courseTitle || 'Course'}</p>
                                <p class="text-sm text-gray-500">${enrollment.course?.courseCode || 'Code'}</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="font-medium ${enrollment.grade ? 'text-green-600' : 'text-gray-500'}">
                                ${enrollment.grade || 'Not graded'}
                            </p>
                            <p class="text-sm text-gray-500">${enrollment.course?.credits || 0} credits</p>
                        </div>
                    </div>
                `).join('');
            }

        } catch (error) {
            ui.showToast('Failed to load grades', 'error');
        } finally {
            ui.hideLoading();
        }
    },

    async loadLecturerCourses() {
        try {
            ui.showLoading();

            const lecturerCourses = await api.getLecturerCourses(currentUser?.id).catch(() => []);

            const container = document.getElementById('lecturerCoursesGrid');
            if (lecturerCourses.length === 0) {
                container.innerHTML = `
                    <div class="col-span-full text-center py-12">
                        <i class="fas fa-book text-gray-400 text-4xl mb-4"></i>
                        <h3 class="text-lg font-medium text-gray-900 mb-2">No courses assigned</h3>
                        <p class="text-gray-500">You haven't been assigned to any courses yet.</p>
                    </div>
                `;
            } else {
                container.innerHTML = lecturerCourses.map(course => `
                    <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
                        <div class="flex items-center justify-between mb-4">
                            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <i class="fas fa-book text-green-600 text-xl"></i>
                            </div>
                            <button onclick="showGradeManagement(${course.id}, '${course.courseTitle}')" class="btn-primary text-sm">
                                <i class="fas fa-graduation-cap mr-1"></i>Manage Grades
                            </button>
                        </div>
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">${course.courseTitle}</h3>
                        <p class="text-sm text-gray-600 mb-2">${course.courseCode}</p>
                        <p class="text-gray-600 mb-4">${course.description}</p>
                        <div class="flex items-center justify-between text-sm mb-3">
                            <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded">${course.credits} Credits</span>
                            <span class="bg-green-100 text-green-800 px-2 py-1 rounded">${course.semester}</span>
                        </div>
                        <div class="text-sm text-gray-600">
                            <div class="flex justify-between">
                                <span><i class="fas fa-users mr-1"></i>${course.enrollments?.length || 0} students</span>
                                <span><i class="fas fa-clipboard-check mr-1"></i>${course.enrollments?.filter(e => !e.grade)?.length || 0} pending grades</span>
                            </div>
                        </div>
                    </div>
                `).join('');
            }

        } catch (error) {
            ui.showToast('Failed to load lecturer courses', 'error');
        } finally {
            ui.hideLoading();
        }
    },

    async loadLecturerStudents() {
        try {
            ui.showLoading();

            const lecturerCourses = await api.getLecturerCourses(currentUser?.id).catch(() => []);
            const allStudents = [];
            
            lecturerCourses.forEach(course => {
                if (course.enrollments) {
                    course.enrollments.forEach(enrollment => {
                        if (enrollment.student) {
                            allStudents.push({
                                ...enrollment.student,
                                course: course,
                                enrollment: enrollment
                            });
                        }
                    });
                }
            });

            const container = document.getElementById('lecturerStudentsList');
            if (allStudents.length === 0) {
                container.innerHTML = `
                    <div class="text-center py-12">
                        <i class="fas fa-users text-gray-400 text-4xl mb-4"></i>
                        <h3 class="text-lg font-medium text-gray-900 mb-2">No students found</h3>
                        <p class="text-gray-500">No students are enrolled in your courses.</p>
                    </div>
                `;
            } else {
                container.innerHTML = allStudents.map(student => `
                    <div class="bg-white rounded-lg shadow-md p-6">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                    <i class="fas fa-user text-blue-600"></i>
                                </div>
                                <div>
                                    <h3 class="text-lg font-semibold text-gray-900">${student.firstName} ${student.lastName}</h3>
                                    <p class="text-sm text-gray-600">${student.email}</p>
                                    <p class="text-sm text-gray-500">${student.admissionNumber} • ${student.department}</p>
                                </div>
                            </div>
                            <div class="text-right">
                                <p class="text-sm font-medium text-gray-900">${student.course.courseTitle}</p>
                                <p class="text-sm text-gray-600">${student.course.courseCode}</p>
                                <p class="text-sm ${student.enrollment.grade ? 'text-green-600' : 'text-orange-600'}">
                                    ${student.enrollment.grade || 'Not graded'}
                                </p>
                            </div>
                        </div>
                    </div>
                `).join('');
            }

        } catch (error) {
            ui.showToast('Failed to load students', 'error');
        } finally {
            ui.hideLoading();
        }
    },

    async loadLecturerGrades() {
        try {
            ui.showLoading();

            const lecturerCourses = await api.getLecturerCourses(currentUser?.id).catch(() => []);
            const courseSelect = document.getElementById('gradeCourseSelect');
            
            courseSelect.innerHTML = '<option value="">Select a course to manage grades</option>' + 
                lecturerCourses.map(course => `<option value="${course.id}">${course.courseCode} - ${course.courseTitle}</option>`).join('');

            // Add event listener for course selection
            courseSelect.onchange = function() {
                const courseId = this.value;
                if (courseId) {
                    const course = lecturerCourses.find(c => c.id == courseId);
                    if (course) {
                        ui.showGradeManagement(courseId, course.courseTitle);
                    }
                }
            };

        } catch (error) {
            ui.showToast('Failed to load grade management', 'error');
        } finally {
            ui.hideLoading();
        }
    },

    // Helper functions for grade calculations
    getGradePoints(grade) {
        const gradeMap = { 'A': 4.0, 'B': 3.0, 'C': 2.0, 'D': 1.0, 'F': 0.0 };
        return gradeMap[grade] || 0;
    },

    getGradeLetter(points) {
        if (points >= 3.5) return 'A';
        if (points >= 2.5) return 'B';
        if (points >= 1.5) return 'C';
        if (points >= 0.5) return 'D';
        return 'F';
    },

    async loadLecturerDashboard() {
        try {
            ui.showLoading();

            // Load lecturer-specific data
            const [lecturerCourses, allStudents] = await Promise.all([
                api.getLecturerCourses(currentUser?.id).catch(() => []),
                api.getStudents().catch(() => [])
            ]);

            // Calculate statistics
            const totalStudents = lecturerCourses.reduce((sum, course) => 
                sum + (course.enrollments?.length || 0), 0);
            const pendingGrades = lecturerCourses.reduce((sum, course) => 
                sum + (course.enrollments?.filter(e => !e.grade)?.length || 0), 0);

            // Update statistics
            document.getElementById('lecturerCourseCount').textContent = lecturerCourses.length;
            document.getElementById('lecturerStudentCount').textContent = totalStudents;
            document.getElementById('lecturerPendingGrades').textContent = pendingGrades;

            // Load lecturer courses
            const coursesContainer = document.getElementById('lecturerCoursesList');
            if (lecturerCourses.length === 0) {
                coursesContainer.innerHTML = `
                    <div class="text-gray-500 text-center py-8">
                        <i class="fas fa-info-circle text-2xl mb-2"></i>
                        <p>No courses assigned</p>
                    </div>
                `;
            } else {
                coursesContainer.innerHTML = lecturerCourses.map(course => `
                    <div class="bg-gray-50 rounded-lg p-4 mb-4">
                        <div class="flex items-center justify-between mb-3">
                            <div class="flex items-center">
                                <i class="fas fa-book text-blue-600 mr-3"></i>
                                <div>
                                    <p class="font-medium">${course.courseTitle}</p>
                                    <p class="text-sm text-gray-500">${course.courseCode} • ${course.credits} credits</p>
                                </div>
                            </div>
                            <button onclick="showGradeManagement(${course.id}, '${course.courseTitle}')" class="btn-primary text-sm">
                                <i class="fas fa-graduation-cap mr-1"></i>Manage Grades
                            </button>
                        </div>
                        <div class="text-sm text-gray-600">
                            <span class="mr-4"><i class="fas fa-users mr-1"></i>${course.enrollments?.length || 0} students</span>
                            <span><i class="fas fa-clipboard-check mr-1"></i>${course.enrollments?.filter(e => !e.grade)?.length || 0} pending grades</span>
                        </div>
                    </div>
                `).join('');
            }

        } catch (error) {
            ui.showToast('Failed to load lecturer dashboard', 'error');
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
                    ${course.lecturerName ? `
                    <div class="mb-4">
                        <p class="text-sm text-gray-600">
                            <i class="fas fa-chalkboard-teacher mr-2"></i>${course.lecturerName}
                        </p>
                    </div>
                    ` : `
                    <div class="mb-4">
                        <p class="text-sm text-gray-500">
                            <i class="fas fa-exclamation-triangle mr-2"></i>No lecturer assigned
                        </p>
                    </div>
                    `}
                    <div class="flex space-x-2">
                        <button onclick="ui.viewCourse(${course.id})" class="btn-outline flex-1">
                            <i class="fas fa-eye mr-2"></i>View
                        </button>
                        <button onclick="ui.editCourse(${course.id})" class="btn-primary flex-1">
                            <i class="fas fa-edit mr-2"></i>Edit
                        </button>
                        ${!course.lecturerName ? `
                        <button onclick="showAssignLecturerModal()" class="btn-secondary flex-1">
                            <i class="fas fa-link mr-2"></i>Assign Lecturer
                        </button>
                        ` : ''}
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

            const [students, courses, lecturers] = await Promise.all([
                api.getStudents().catch(() => []),
                api.getCourses().catch(() => []),
                api.getLecturers().catch(() => [])
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

    async loadLecturers() {
        try {
            ui.showLoading();
            const lecturers = await api.getLecturers();
            const lecturersList = document.getElementById('lecturersList');
            
            if (lecturers.length === 0) {
                lecturersList.innerHTML = `
                    <div class="text-center py-12 col-span-3">
                        <i class="fas fa-chalkboard-teacher text-gray-400 text-4xl mb-4"></i>
                        <h3 class="text-lg font-medium text-gray-900 mb-2">No lecturers found</h3>
                        <p class="text-gray-500">No lecturers are currently registered.</p>
                    </div>
                `;
                return;
            }
            
            lecturersList.innerHTML = lecturers.map(lecturer => `
                <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center">
                            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <i class="fas fa-chalkboard-teacher text-purple-600 text-xl"></i>
                            </div>
                            <div class="ml-4">
                                <h3 class="text-lg font-semibold text-gray-900">${lecturer.firstName} ${lecturer.lastName}</h3>
                                <p class="text-sm text-gray-600">${lecturer.employeeNumber}</p>
                            </div>
                        </div>
                        <div class="flex space-x-2">
                            <button onclick="viewLecturer(${lecturer.id})" class="text-blue-600 hover:text-blue-800">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button onclick="editLecturer(${lecturer.id})" class="text-green-600 hover:text-green-800">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button onclick="deleteLecturer(${lecturer.id})" class="text-red-600 hover:text-red-800">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span class="text-gray-600">Email:</span>
                            <span class="font-medium">${lecturer.email}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Department:</span>
                            <span class="font-medium">${lecturer.department}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Specialization:</span>
                            <span class="font-medium">${lecturer.specialization}</span>
                        </div>
                        ${lecturer.phoneNumber ? `
                        <div class="flex justify-between">
                            <span class="text-gray-600">Phone:</span>
                            <span class="font-medium">${lecturer.phoneNumber}</span>
                        </div>
                        ` : ''}
                    </div>
                </div>
            `).join('');
            
            ui.hideLoading();
        } catch (error) {
            ui.hideLoading();
            ui.showToast(error.message || 'Failed to load lecturers', 'error');
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
    },

    // Lecturer Management Functions
    viewLecturer(id) {
        // TODO: Implement lecturer detail view
        ui.showToast('Lecturer detail view coming soon', 'info');
    },

    editLecturer(id) {
        // TODO: Implement lecturer edit
        ui.showToast('Lecturer edit coming soon', 'info');
    },

    deleteLecturer(id) {
        if (confirm('Are you sure you want to delete this lecturer?')) {
            api.deleteLecturer(id)
                .then(() => {
                    ui.showToast('Lecturer deleted successfully', 'success');
                    ui.loadLecturers();
                })
                .catch(error => {
                    ui.showToast(error.message || 'Failed to delete lecturer', 'error');
                });
        }
    },

    showGradeManagement(courseId, courseTitle) {
        // Load enrollments for the course and show grade management modal
        api.getCourseEnrollments(currentUser.id, courseId)
            .then(enrollments => {
                document.getElementById('gradeCourseTitle').textContent = courseTitle;
                document.getElementById('gradeCourseInfo').textContent = `${enrollments.length} students enrolled`;
                
                const enrollmentsList = document.getElementById('gradeEnrollmentsList');
                enrollmentsList.innerHTML = enrollments.map(enrollment => `
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                            <p class="font-medium">${enrollment.student.firstName} ${enrollment.student.lastName}</p>
                            <p class="text-sm text-gray-600">${enrollment.student.admissionNumber}</p>
                        </div>
                        <div class="flex items-center space-x-2">
                            <select id="grade-${enrollment.id}" class="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500">
                                <option value="">No Grade</option>
                                <option value="A" ${enrollment.grade === 'A' ? 'selected' : ''}>A</option>
                                <option value="B" ${enrollment.grade === 'B' ? 'selected' : ''}>B</option>
                                <option value="C" ${enrollment.grade === 'C' ? 'selected' : ''}>C</option>
                                <option value="D" ${enrollment.grade === 'D' ? 'selected' : ''}>D</option>
                                <option value="F" ${enrollment.grade === 'F' ? 'selected' : ''}>F</option>
                            </select>
                            <button onclick="assignGrade(${enrollment.id})" class="btn-primary px-3 py-1 text-sm">
                                <i class="fas fa-save"></i>
                            </button>
                        </div>
                    </div>
                `).join('');
                
                ui.showModal('gradeManagementModal');
            })
            .catch(error => {
                ui.showToast(error.message || 'Failed to load enrollments', 'error');
            });
    },

    assignGrade(enrollmentId) {
        const gradeSelect = document.getElementById(`grade-${enrollmentId}`);
        const grade = gradeSelect.value;
        
        if (!grade) {
            ui.showToast('Please select a grade', 'error');
            return;
        }
        
        api.assignGrade(currentUser.id, enrollmentId, grade)
            .then(() => {
                ui.showToast('Grade assigned successfully', 'success');
            })
            .catch(error => {
                ui.showToast(error.message || 'Failed to assign grade', 'error');
            });
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

            // Redirect based on selected role and user role
            if (currentUserRole === 'admin' || currentUser.role === 'ADMIN') {
                ui.showSection('admin');
            } else if (currentUserRole === 'student') {
                ui.showSection('studentDashboard');
            } else if (currentUserRole === 'lecturer') {
                ui.showSection('lecturerDashboard');
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
        currentUserRole = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');

        ui.updateAuthUI();
        ui.showSection('roleSelection');
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
    },

    handleAddLecturer(event) {
        event.preventDefault();
        
        const lecturerData = {
            firstName: document.getElementById('lecturerFirstName').value,
            lastName: document.getElementById('lecturerLastName').value,
            email: document.getElementById('lecturerEmail').value,
            employeeNumber: document.getElementById('lecturerEmployeeNumber').value,
            department: document.getElementById('lecturerDepartment').value,
            specialization: document.getElementById('lecturerSpecialization').value,
            phoneNumber: document.getElementById('lecturerPhoneNumber').value
        };

        api.createLecturer(lecturerData)
            .then(() => {
                ui.hideModal('addLecturerModal');
                ui.showToast('Lecturer added successfully', 'success');
                ui.loadLecturers();
                // Clear form
                document.getElementById('addLecturerForm').reset();
            })
            .catch(error => {
                ui.showToast(error.message || 'Failed to add lecturer', 'error');
            });
    },

    handleAssignLecturer(event) {
        event.preventDefault();
        
        const courseId = document.getElementById('courseSelect').value;
        const lecturerId = document.getElementById('lecturerSelect').value;

        if (!courseId || !lecturerId) {
            ui.showToast('Please select both course and lecturer', 'error');
            return;
        }

        api.assignLecturerToCourse(courseId, lecturerId)
            .then(() => {
                ui.hideModal('assignLecturerModal');
                ui.showToast('Lecturer assigned to course successfully', 'success');
                ui.loadCourses();
                // Clear form
                document.getElementById('assignLecturerForm').reset();
            })
            .catch(error => {
                ui.showToast(error.message || 'Failed to assign lecturer', 'error');
            });
    }
};

// Utility Functions
const utils = {
    refreshData() {
        // Find the currently active section
        const activeSection = document.querySelector('.section:not(.hidden)');
        if (activeSection) {
            ui.loadSectionData(activeSection.id);
        } else {
            ui.loadSectionData('dashboard');
        }
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
    ui.showSection('roleSelection');

    // Form event listeners
    document.getElementById('loginForm').addEventListener('submit', forms.handleLogin);
    document.getElementById('registerForm').addEventListener('submit', forms.handleRegister);
    document.getElementById('addCourseForm').addEventListener('submit', forms.handleAddCourse);
    document.getElementById('addStudentForm').addEventListener('submit', forms.handleAddStudent);
    document.getElementById('addLecturerForm').addEventListener('submit', forms.handleAddLecturer);
    document.getElementById('assignLecturerForm').addEventListener('submit', forms.handleAssignLecturer);

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
window.showSection = ui.showSection;

// Role selection function
window.selectRole = function(role) {
    currentUserRole = role;
    localStorage.setItem('userRole', role);
    
    // Show login modal for the selected role
    ui.showModal('loginModal');
    
    // Update login modal title based on role
    const loginTitle = document.querySelector('#loginModal .modal-header h2');
    if (loginTitle) {
        loginTitle.textContent = `Login as ${role.charAt(0).toUpperCase() + role.slice(1)}`;
    }
    
    // Update demo credentials based on role
    const demoCredentials = document.querySelector('#loginModal .bg-blue-50 p');
    if (demoCredentials) {
        if (role === 'admin') {
            demoCredentials.innerHTML = '<strong>Demo Credentials:</strong><br>Username: admin<br>Password: admin123';
        } else if (role === 'student') {
            demoCredentials.innerHTML = '<strong>Demo Credentials:</strong><br>Use your admission number as username<br>Password: student123';
        } else if (role === 'lecturer') {
            demoCredentials.innerHTML = '<strong>Demo Credentials:</strong><br>Use your lecturer ID as username<br>Password: lecturer123';
        }
    }
};

window.showLoginModal = () => ui.showModal('loginModal');
window.showRegisterModal = () => ui.showModal('registerModal');
window.showAddCourseModal = () => ui.showModal('addCourseModal');
window.showAddStudentModal = () => ui.showModal('addStudentModal');
window.showAddLecturerModal = () => ui.showModal('addLecturerModal');
window.showAssignLecturerModal = () => {
    // Load courses and lecturers for the assignment modal
    Promise.all([api.getCourses(), api.getLecturers()])
        .then(([courses, lecturers]) => {
            const courseSelect = document.getElementById('courseSelect');
            const lecturerSelect = document.getElementById('lecturerSelect');
            
            courseSelect.innerHTML = '<option value="">Select Course</option>' + 
                courses.map(course => `<option value="${course.id}">${course.courseCode} - ${course.courseTitle}</option>`).join('');
            
            lecturerSelect.innerHTML = '<option value="">Select Lecturer</option>' + 
                lecturers.map(lecturer => `<option value="${lecturer.id}">${lecturer.firstName} ${lecturer.lastName} (${lecturer.department})</option>`).join('');
            
            ui.showModal('assignLecturerModal');
        })
        .catch(error => {
            ui.showToast('Failed to load courses and lecturers', 'error');
        });
};
window.hideModal = ui.hideModal;
window.logout = auth.logout;
window.refreshData = utils.refreshData;
window.exportData = utils.exportData;
window.viewLecturer = ui.viewLecturer;
window.editLecturer = ui.editLecturer;
window.deleteLecturer = ui.deleteLecturer;
window.assignGrade = ui.assignGrade;

// Student enrollment function
window.enrollInCourse = async function(courseId) {
    try {
        ui.showLoading();
        await api.enrollStudent(currentUser?.id, courseId);
        ui.showToast('Successfully enrolled in course!', 'success');
        ui.loadStudentDashboard(); // Refresh the dashboard
    } catch (error) {
        ui.showToast('Failed to enroll in course: ' + error.message, 'error');
    } finally {
        ui.hideLoading();
    }
};

// Extend ui object with updateAuthUI method
ui.updateAuthUI = function() {
    const userMenu = document.getElementById('userMenu');
    const authButtons = document.getElementById('authButtons');

    if (currentUser) {
        userMenu.classList.remove('hidden');
        authButtons.classList.add('hidden');
    } else {
        userMenu.classList.add('hidden');
        authButtons.classList.remove('hidden');
    }
};