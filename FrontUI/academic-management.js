// Academic Management JavaScript
let currentEnrollmentId = null;
let currentCourseId = null;
let currentLecturerId = null;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializeAcademicManagement();
});

async function initializeAcademicManagement() {
    try {
        // Check authentication
        const token = localStorage.getItem('token');
        const userRole = localStorage.getItem('userRole');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        if (!token) {
            window.location.href = 'home.html';
            return;
        }
        
        // Set global variables from app.js
        if (typeof authToken !== 'undefined') {
            authToken = token;
        }
        
        // Set user role display
        document.getElementById('userRole').textContent = userRole || 'User';
        
        // Show admin-specific tabs for admin users
        if (userRole === 'ADMIN') {
            document.getElementById('adminTab').style.display = 'block';
            document.getElementById('logsTab').style.display = 'block';
        }
        
        // Load profile data
        await loadProfile();
        
        // Load initial data
        await loadDashboardStats();
        await loadEnrollments();
        await loadDropdownData();
        
        // Load system logs if admin
        if (userRole === 'ADMIN') {
            await loadSystemLogs();
        }
        
    } catch (error) {
        console.error('Initialization error:', error);
        showNotification('Failed to initialize academic management', 'error');
    }
}

// Dashboard Stats
async function loadDashboardStats() {
    try {
        showLoading(true);
        const stats = await api.getDashboardStats();
        
        const statsContainer = document.getElementById('dashboardStats');
        statsContainer.innerHTML = `
            <div class="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-gray-200">
                <div class="flex items-center">
                    <div class="p-3 rounded-full bg-blue-100 text-blue-600">
                        <i class="fas fa-users text-2xl"></i>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600">Total Students</p>
                        <p class="text-2xl font-bold text-gray-900">${stats.totalStudents}</p>
                    </div>
                </div>
            </div>
            <div class="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-gray-200">
                <div class="flex items-center">
                    <div class="p-3 rounded-full bg-green-100 text-green-600">
                        <i class="fas fa-book text-2xl"></i>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600">Total Courses</p>
                        <p class="text-2xl font-bold text-gray-900">${stats.totalCourses}</p>
                    </div>
                </div>
            </div>
            <div class="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-gray-200">
                <div class="flex items-center">
                    <div class="p-3 rounded-full bg-purple-100 text-purple-600">
                        <i class="fas fa-chalkboard-teacher text-2xl"></i>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600">Total Lecturers</p>
                        <p class="text-2xl font-bold text-gray-900">${stats.totalLecturers}</p>
                    </div>
                </div>
            </div>
            <div class="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-gray-200">
                <div class="flex items-center">
                    <div class="p-3 rounded-full bg-indigo-100 text-indigo-600">
                        <i class="fas fa-user-graduate text-2xl"></i>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600">Total Enrollments</p>
                        <p class="text-2xl font-bold text-gray-900">${stats.totalEnrollments}</p>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Failed to load dashboard stats:', error);
        showNotification('Failed to load dashboard statistics', 'error');
    } finally {
        showLoading(false);
    }
}

// Tab Management
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.add('hidden');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName + '-tab').classList.remove('hidden');
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Load tab-specific data
    switch(tabName) {
        case 'enrollments':
            loadEnrollments();
            break;
        case 'grades':
            loadGrades();
            break;
        case 'assignments':
            loadCourseAssignments();
            break;
        case 'management':
            // Admin management tab - no specific loading needed
            break;
    }
}

// Enrollments Management
async function loadEnrollments() {
    try {
        showLoading(true);
        const students = await api.getStudents();
        const courses = await api.getCourses();
        
        const enrollmentsList = document.getElementById('enrollmentsList');
        let enrollmentsHTML = '';
        
        // Get all enrollments by checking each student
        for (const student of students) {
            try {
                const enrollments = await api.getEnrollments(student.id || student.studentId);
                if (enrollments && enrollments.length > 0) {
                    enrollments.forEach(enrollment => {
                        const course = courses.find(c => c.id === enrollment.courseId);
                        enrollmentsHTML += `
                            <div class="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                                <div class="flex justify-between items-start">
                                    <div class="flex-1">
                                        <h3 class="text-lg font-semibold text-gray-900">
                                            ${student.firstName} ${student.lastName}
                                        </h3>
                                        <p class="text-gray-600">Student ID: ${student.admissionNumber}</p>
                                        <p class="text-gray-600">Course: ${course ? course.courseTitle : 'Unknown Course'}</p>
                                        <p class="text-gray-600">Enrolled: ${new Date(enrollment.enrollmentDate).toLocaleDateString()}</p>
                                        <div class="mt-2">
                                            <span class="px-3 py-1 rounded-full text-sm font-medium ${
                                                enrollment.grade ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }">
                                                Grade: ${enrollment.grade || 'Not Assigned'}
                                            </span>
                                        </div>
                                    </div>
                                    <div class="flex space-x-2">
                                        <button onclick="showGradeModal(${enrollment.id})" 
                                                class="btn-glass bg-blue-600 text-white hover:bg-blue-700">
                                            <i class="fas fa-graduation-cap mr-1"></i>Grade
                                        </button>
                                        <button onclick="removeEnrollment(${enrollment.id})" 
                                                class="btn-glass bg-red-600 text-white hover:bg-red-700">
                                            <i class="fas fa-trash mr-1"></i>Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `;
                    });
                }
            } catch (error) {
                console.error(`Failed to load enrollments for student ${student.id}:`, error);
            }
        }
        
        if (!enrollmentsHTML) {
            enrollmentsHTML = `
                <div class="text-center py-12">
                    <i class="fas fa-user-graduate text-4xl text-gray-400 mb-4"></i>
                    <p class="text-gray-600">No enrollments found</p>
                </div>
            `;
        }
        
        enrollmentsList.innerHTML = enrollmentsHTML;
        
    } catch (error) {
        console.error('Failed to load enrollments:', error);
        showNotification('Failed to load enrollments', 'error');
    } finally {
        showLoading(false);
    }
}

// Grade Management
async function loadGrades() {
    try {
        showLoading(true);
        const students = await api.getStudents();
        const courses = await api.getCourses();
        
        const gradesList = document.getElementById('gradesList');
        let gradesHTML = '';
        
        // Load grades from enrollments
        for (const student of students) {
            try {
                const enrollments = await api.getEnrollments(student.id || student.studentId);
                if (enrollments && enrollments.length > 0) {
                    enrollments.forEach(enrollment => {
                        const course = courses.find(c => c.id === enrollment.courseId);
                        gradesHTML += `
                            <div class="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                                    <div>
                                        <h3 class="font-semibold text-gray-900">${student.firstName} ${student.lastName}</h3>
                                        <p class="text-sm text-gray-600">${student.admissionNumber}</p>
                                    </div>
                                    <div>
                                        <p class="font-medium text-gray-900">${course ? course.courseTitle : 'Unknown Course'}</p>
                                        <p class="text-sm text-gray-600">${course ? course.courseCode : 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span class="px-3 py-1 rounded-full text-sm font-medium ${
                                            enrollment.grade ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                                        }">
                                            ${enrollment.grade || 'No Grade'}
                                        </span>
                                    </div>
                                    <div class="flex justify-end">
                                        <button onclick="showGradeModal(${enrollment.id})" 
                                                class="btn-glass bg-indigo-600 text-white hover:bg-indigo-700">
                                            <i class="fas fa-edit mr-1"></i>Update Grade
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `;
                    });
                }
            } catch (error) {
                console.error(`Failed to load grades for student ${student.id}:`, error);
            }
        }
        
        if (!gradesHTML) {
            gradesHTML = `
                <div class="text-center py-12">
                    <i class="fas fa-graduation-cap text-4xl text-gray-400 mb-4"></i>
                    <p class="text-gray-600">No grades found</p>
                </div>
            `;
        }
        
        gradesList.innerHTML = gradesHTML;
        
    } catch (error) {
        console.error('Failed to load grades:', error);
        showNotification('Failed to load grades', 'error');
    } finally {
        showLoading(false);
    }
}

// Course Assignments
async function loadCourseAssignments() {
    try {
        showLoading(true);
    const courses = await api.getCourses();
    const lecturers = await api.getLecturers();
        
        const assignmentsList = document.getElementById('assignmentsList');
        let assignmentsHTML = '';
        
        courses.forEach(course => {
            const lecturer = lecturers.find(l => l.id === course.lecturerId);
            assignmentsHTML += `
                <div class="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                    <div class="flex justify-between items-start">
                        <div class="flex-1">
                            <h3 class="text-lg font-semibold text-gray-900">${course.courseTitle}</h3>
                            <p class="text-gray-600">Course Code: ${course.courseCode}</p>
                            <p class="text-gray-600">Credits: ${course.credits}</p>
                            <p class="text-gray-600">Semester: ${course.semester}</p>
                            <div class="mt-2">
                                <span class="px-3 py-1 rounded-full text-sm font-medium ${
                                    lecturer ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }">
                                    ${lecturer ? `Assigned to: ${lecturer.firstName} ${lecturer.lastName}` : 'No Lecturer Assigned'}
                                </span>
                            </div>
                        </div>
                        <div class="flex space-x-2">
                            <button onclick="showAssignModal(${course.id})" 
                                    class="btn-glass bg-green-600 text-white hover:bg-green-700">
                                <i class="fas fa-user-tie mr-1"></i>${lecturer ? 'Reassign' : 'Assign'}
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        assignmentsList.innerHTML = assignmentsHTML;
        
    } catch (error) {
        console.error('Failed to load course assignments:', error);
        showNotification('Failed to load course assignments', 'error');
    } finally {
        showLoading(false);
    }
}

// Load dropdown data
async function loadDropdownData() {
    try {
        const [students, courses, lecturers] = await Promise.all([
            api.getStudents(),
            api.getCourses(),
            api.getLecturers()
        ]);
        
        // Populate student dropdowns
        const studentSelects = document.querySelectorAll('#enrollStudentSelect');
        studentSelects.forEach(select => {
            select.innerHTML = '<option value="">Select Student</option>';
            students.forEach(student => {
                select.innerHTML += `<option value="${student.id}">${student.firstName} ${student.lastName} (${student.admissionNumber})</option>`;
            });
        });
        
        // Populate course dropdowns
        const courseSelects = document.querySelectorAll('#enrollCourseSelect, #assignCourseSelect, #courseFilter');
        courseSelects.forEach(select => {
            const defaultOption = select.id === 'courseFilter' ? '<option value="">All Courses</option>' : '<option value="">Select Course</option>';
            select.innerHTML = defaultOption;
            courses.forEach(course => {
                select.innerHTML += `<option value="${course.id}">${course.courseTitle} (${course.courseCode})</option>`;
            });
        });
        
        // Populate lecturer dropdowns
        const lecturerSelects = document.querySelectorAll('#assignLecturerSelect');
        lecturerSelects.forEach(select => {
            select.innerHTML = '<option value="">Select Lecturer</option>';
            lecturers.forEach(lecturer => {
                select.innerHTML += `<option value="${lecturer.id}">${lecturer.firstName} ${lecturer.lastName}</option>`;
            });
        });
        
    } catch (error) {
        console.error('Failed to load dropdown data:', error);
        showNotification('Failed to load form data', 'error');
    }
}

// Modal Functions
function showEnrollModal() {
    document.getElementById('enrollModal').classList.remove('hidden');
}

function showGradeModal(enrollmentId) {
    currentEnrollmentId = enrollmentId;
    document.getElementById('gradeModal').classList.remove('hidden');
}

function showAssignModal(courseId) {
    currentCourseId = courseId;
    document.getElementById('assignModal').classList.remove('hidden');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
    // Reset form if exists
    const form = document.querySelector(`#${modalId} form`);
    if (form) form.reset();
}

// Form Handlers
document.getElementById('enrollForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const studentId = document.getElementById('enrollStudentSelect').value;
    const courseId = document.getElementById('enrollCourseSelect').value;
    
    try {
        showLoading(true);
        
        // Check if course is full before enrollment (Student role requirement)
        const course = await api.getCourse(courseId);
        const enrollments = await api.getEnrollments(studentId);
        const courseEnrollments = enrollments.filter(e => e.courseId === courseId);
        
        // Assume max capacity of 30 students per course
        const maxCapacity = course.maxCapacity || 30;
        
        if (courseEnrollments.length >= maxCapacity) {
            showNotification('Cannot enroll: Course is full', 'error');
            return;
        }
        
        await api.enrollStudent(studentId, courseId);
        showNotification('Student enrolled successfully', 'success');
        closeModal('enrollModal');
        loadEnrollments();
        loadDashboardStats();
        
        // Log the enrollment activity
        logActivity('Enrollment', `Student ${studentId} enrolled in course ${courseId}`, localStorage.getItem('userRole'));
        
    } catch (error) {
        console.error('Failed to enroll student:', error);
        showNotification('Failed to enroll student', 'error');
    } finally {
        showLoading(false);
    }
});

document.getElementById('gradeForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const grade = document.getElementById('gradeSelect').value;
    const userRole = localStorage.getItem('userRole');
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    
    try {
        showLoading(true);
        
        // Security check for lecturers - prevent editing grades for unassigned courses
        if (userRole === 'LECTURER') {
            const enrollment = await api.getEnrollment(currentEnrollmentId);
            const course = await api.getCourse(enrollment.courseId);
            
            // Check if the lecturer is assigned to this course
            if (course.lecturerId !== currentUser.id) {
                showNotification('Access denied: You can only grade students in your assigned courses', 'error');
                return;
            }
        }
        
        await api.assignGradeAdmin(currentEnrollmentId, grade);
        showNotification('Grade assigned successfully', 'success');
        closeModal('gradeModal');
        loadGrades();
        loadEnrollments();
        
        // Log the grade submission activity
        logActivity('Grade Submission', `Grade ${grade} assigned to enrollment ${currentEnrollmentId}`, currentUser.email || currentUser.username);
        
    } catch (error) {
        console.error('Failed to assign grade:', error);
        showNotification('Failed to assign grade', 'error');
    } finally {
        showLoading(false);
    }
});

document.getElementById('assignForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const courseId = document.getElementById('assignCourseSelect').value;
    const lecturerId = document.getElementById('assignLecturerSelect').value;
    
    try {
        showLoading(true);
    await api.assignLecturerToCourseAdmin(courseId, lecturerId);
        showNotification('Lecturer assigned successfully', 'success');
        closeModal('assignModal');
        loadCourseAssignments();
    } catch (error) {
        console.error('Failed to assign lecturer:', error);
        showNotification('Failed to assign lecturer', 'error');
    } finally {
        showLoading(false);
    }
});

// Action Functions
async function removeEnrollment(enrollmentId) {
    if (!confirm('Are you sure you want to remove this enrollment?')) return;
    
    try {
        showLoading(true);
        await api.removeEnrollment(enrollmentId);
        showNotification('Enrollment removed successfully', 'success');
        loadEnrollments();
        loadDashboardStats();
    } catch (error) {
        console.error('Failed to remove enrollment:', error);
        showNotification('Failed to remove enrollment', 'error');
    } finally {
        showLoading(false);
    }
}

// Utility Functions
function showLoading(show) {
    const spinner = document.getElementById('loadingSpinner');
    if (show) {
        spinner.classList.remove('hidden');
    } else {
        spinner.classList.add('hidden');
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
        type === 'success' ? 'bg-green-500 text-white' :
        type === 'error' ? 'bg-red-500 text-white' :
        'bg-blue-500 text-white'
    }`;
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas ${
                type === 'success' ? 'fa-check-circle' :
                type === 'error' ? 'fa-exclamation-circle' :
                'fa-info-circle'
            } mr-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function goBack() {
    window.location.href = 'dashboard-unified.html';
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
    localStorage.removeItem('selectedRole');
    window.location.href = 'home.html';
}

// Refresh functions
function refreshGrades() {
    loadGrades();
}

// Activity logging function
function logActivity(action, details, user) {
    try {
        const logs = JSON.parse(localStorage.getItem('systemLogs') || '[]');
        const newLog = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            action: action,
            details: details,
            user: user || 'System',
            type: 'info'
        };
        
        logs.unshift(newLog); // Add to beginning
        
        // Keep only last 100 logs
        if (logs.length > 100) {
            logs.splice(100);
        }
        
        localStorage.setItem('systemLogs', JSON.stringify(logs));
        
        // Refresh logs display if currently viewing
        const currentTab = document.querySelector('.tab-button.active')?.dataset.tab;
        if (currentTab === 'logs') {
            loadSystemLogs();
        }
        
    } catch (error) {
        console.error('Failed to log activity:', error);
    }
}

// Admin Management Functions
function showCreateStudentModal() {
    // Create and show student creation modal
    const modal = document.createElement('div');
    modal.id = 'createStudentModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="text-lg font-semibold">Create New Student</h3>
                <button onclick="closeModal('createStudentModal')" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <form id="createStudentForm" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Student ID</label>
                    <input type="text" id="studentId" class="form-input w-full" required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input type="text" id="firstName" class="form-input w-full" required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input type="text" id="lastName" class="form-input w-full" required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input type="email" id="email" class="form-input w-full" required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input type="tel" id="phone" class="form-input w-full">
                </div>
                <div class="flex justify-end space-x-3 pt-4">
                    <button type="button" onclick="closeModal('createStudentModal')" class="btn-glass">Cancel</button>
                    <button type="submit" class="btn-glass bg-green-600 text-white hover:bg-green-700">Create Student</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
    modal.classList.remove('hidden');
    
    // Add form handler
    document.getElementById('createStudentForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = {
            studentId: document.getElementById('studentId').value,
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value
        };
        
        try {
            showLoading(true);
            await api.createStudent(formData);
            showNotification('Student created successfully', 'success');
            closeModal('createStudentModal');
            loadDashboardStats();
        } catch (error) {
            console.error('Failed to create student:', error);
            showNotification('Failed to create student: ' + error.message, 'error');
        } finally {
            showLoading(false);
        }
    });
}

function showCreateCourseModal() {
    const modal = document.createElement('div');
    modal.id = 'createCourseModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="text-lg font-semibold">Create New Course</h3>
                <button onclick="closeModal('createCourseModal')" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <form id="createCourseForm" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Course Code</label>
                    <input type="text" id="courseCode" class="form-input w-full" required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
                    <input type="text" id="courseTitle" class="form-input w-full" required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Credits</label>
                    <input type="number" id="credits" class="form-input w-full" min="1" max="6" required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea id="description" class="form-input w-full" rows="3"></textarea>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Semester</label>
                    <select id="semester" class="form-select w-full" required>
                        <option value="">Select Semester</option>
                        <option value="Fall 2024">Fall 2024</option>
                        <option value="Spring 2025">Spring 2025</option>
                        <option value="Summer 2025">Summer 2025</option>
                    </select>
                </div>
                <div class="flex justify-end space-x-3 pt-4">
                    <button type="button" onclick="closeModal('createCourseModal')" class="btn-glass">Cancel</button>
                    <button type="submit" class="btn-glass bg-green-600 text-white hover:bg-green-700">Create Course</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
    modal.classList.remove('hidden');
    
    document.getElementById('createCourseForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = {
            courseCode: document.getElementById('courseCode').value,
            courseTitle: document.getElementById('courseTitle').value,
            credits: parseInt(document.getElementById('credits').value),
            description: document.getElementById('description').value,
            semester: document.getElementById('semester').value
        };
        
        try {
            showLoading(true);
            await api.createCourse(formData);
            showNotification('Course created successfully', 'success');
            closeModal('createCourseModal');
            loadDashboardStats();
            loadDropdownData();
        } catch (error) {
            console.error('Failed to create course:', error);
            showNotification('Failed to create course: ' + error.message, 'error');
        } finally {
            showLoading(false);
        }
    });
}

function showCreateLecturerModal() {
    const modal = document.createElement('div');
    modal.id = 'createLecturerModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="text-lg font-semibold">Create New Lecturer</h3>
                <button onclick="closeModal('createLecturerModal')" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <form id="createLecturerForm" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
                    <input type="text" id="employeeId" class="form-input w-full" required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input type="text" id="lecturerFirstName" class="form-input w-full" required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input type="text" id="lecturerLastName" class="form-input w-full" required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input type="email" id="lecturerEmail" class="form-input w-full" required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Department</label>
                    <input type="text" id="department" class="form-input w-full" required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input type="tel" id="lecturerPhone" class="form-input w-full">
                </div>
                <div class="flex justify-end space-x-3 pt-4">
                    <button type="button" onclick="closeModal('createLecturerModal')" class="btn-glass">Cancel</button>
                    <button type="submit" class="btn-glass bg-green-600 text-white hover:bg-green-700">Create Lecturer</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
    modal.classList.remove('hidden');
    
    document.getElementById('createLecturerForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = {
            employeeId: document.getElementById('employeeId').value,
            firstName: document.getElementById('lecturerFirstName').value,
            lastName: document.getElementById('lecturerLastName').value,
            email: document.getElementById('lecturerEmail').value,
            department: document.getElementById('department').value,
            phone: document.getElementById('lecturerPhone').value
        };
        
        try {
            showLoading(true);
            await api.createLecturer(formData);
            showNotification('Lecturer created successfully', 'success');
            closeModal('createLecturerModal');
            loadDashboardStats();
            loadDropdownData();
        } catch (error) {
            console.error('Failed to create lecturer:', error);
            showNotification('Failed to create lecturer: ' + error.message, 'error');
        } finally {
            showLoading(false);
        }
    });
}

async function loadStudents() {
    try {
        showLoading(true);
        const students = await api.getStudents();
        
        // Create students list modal
        const modal = document.createElement('div');
        modal.id = 'studentsListModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content max-w-4xl">
                <div class="modal-header">
                    <h3 class="text-lg font-semibold">All Students</h3>
                    <button onclick="closeModal('studentsListModal')" class="text-gray-400 hover:text-gray-600">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            ${students.map(student => `
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${student.studentId}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${student.firstName} ${student.lastName}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${student.email}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button onclick="editStudent(${student.id})" class="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                                        <button onclick="deleteStudent(${student.id})" class="text-red-600 hover:text-red-900">Delete</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.classList.remove('hidden');
        
    } catch (error) {
        console.error('Failed to load students:', error);
        showNotification('Failed to load students', 'error');
    } finally {
        showLoading(false);
    }
}

async function loadCourses() {
    try {
        showLoading(true);
        const courses = await api.getCourses();
        
        const modal = document.createElement('div');
        modal.id = 'coursesListModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content max-w-4xl">
                <div class="modal-header">
                    <h3 class="text-lg font-semibold">All Courses</h3>
                    <button onclick="closeModal('coursesListModal')" class="text-gray-400 hover:text-gray-600">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Code</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semester</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            ${courses.map(course => `
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${course.courseCode}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${course.courseTitle}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${course.credits}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${course.semester || 'N/A'}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button onclick="editCourse(${course.id})" class="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                                        <button onclick="deleteCourse(${course.id})" class="text-red-600 hover:text-red-900">Delete</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.classList.remove('hidden');
        
    } catch (error) {
        console.error('Failed to load courses:', error);
        showNotification('Failed to load courses', 'error');
    } finally {
        showLoading(false);
    }
}

async function loadLecturers() {
    try {
        showLoading(true);
        const lecturers = await api.getLecturers();
        
        const modal = document.createElement('div');
        modal.id = 'lecturersListModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content max-w-4xl">
                <div class="modal-header">
                    <h3 class="text-lg font-semibold">All Lecturers</h3>
                    <button onclick="closeModal('lecturersListModal')" class="text-gray-400 hover:text-gray-600">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            ${lecturers.map(lecturer => `
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${lecturer.employeeId}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${lecturer.firstName} ${lecturer.lastName}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${lecturer.department}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${lecturer.email}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button onclick="editLecturer(${lecturer.id})" class="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                                        <button onclick="deleteLecturer(${lecturer.id})" class="text-red-600 hover:text-red-900">Delete</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.classList.remove('hidden');
        
    } catch (error) {
        console.error('Failed to load lecturers:', error);
        showNotification('Failed to load lecturers', 'error');
    } finally {
        showLoading(false);
    }
}

// CRUD operation functions
async function deleteStudent(studentId) {
    if (!confirm('Are you sure you want to delete this student?')) return;
    
    try {
        showLoading(true);
        await api.deleteStudent(studentId);
        showNotification('Student deleted successfully', 'success');
        closeModal('studentsListModal');
        loadDashboardStats();
    } catch (error) {
        console.error('Failed to delete student:', error);
        showNotification('Failed to delete student', 'error');
    } finally {
        showLoading(false);
    }
}

async function deleteCourse(courseId) {
    if (!confirm('Are you sure you want to delete this course?')) return;
    
    try {
        showLoading(true);
        await api.deleteCourse(courseId);
        showNotification('Course deleted successfully', 'success');
        closeModal('coursesListModal');
        loadDashboardStats();
        loadDropdownData();
    } catch (error) {
        console.error('Failed to delete course:', error);
        showNotification('Failed to delete course', 'error');
    } finally {
        showLoading(false);
    }
}

async function deleteLecturer(lecturerId) {
    if (!confirm('Are you sure you want to delete this lecturer?')) return;
    
    try {
        showLoading(true);
        await api.deleteLecturer(lecturerId);
        showNotification('Lecturer deleted successfully', 'success');
        closeModal('lecturersListModal');
        loadDashboardStats();
        loadDropdownData();
    } catch (error) {
        console.error('Failed to delete lecturer:', error);
        showNotification('Failed to delete lecturer', 'error');
    } finally {
        showLoading(false);
    }
}

// Edit functions (placeholder for now)
function editStudent(studentId) {
    showNotification('Student edit functionality - Coming soon!', 'info');
}

function editCourse(courseId) {
    showNotification('Course edit functionality - Coming soon!', 'info');
}

function editLecturer(lecturerId) {
    showNotification('Lecturer edit functionality - Coming soon!', 'info');
}

// System Logs Management
async function loadSystemLogs() {
    try {
        // Mock system logs data - in real implementation, this would come from backend
        const logs = [
            {
                id: 1,
                timestamp: new Date().toISOString(),
                action: 'User Registration',
                details: 'New student STU002 registered',
                user: 'System',
                type: 'info'
            },
            {
                id: 2,
                timestamp: new Date(Date.now() - 3600000).toISOString(),
                action: 'Grade Submission',
                details: 'Grade A assigned to student STU001 for course CS101',
                user: 'john.doe@test.com',
                type: 'success'
            },
            {
                id: 3,
                timestamp: new Date(Date.now() - 7200000).toISOString(),
                action: 'Course Creation',
                details: 'New course CS301 - Advanced Programming created',
                user: 'admin',
                type: 'info'
            },
            {
                id: 4,
                timestamp: new Date(Date.now() - 10800000).toISOString(),
                action: 'Enrollment',
                details: 'Student STU001 enrolled in course CS201',
                user: 'admin',
                type: 'info'
            },
            {
                id: 5,
                timestamp: new Date(Date.now() - 14400000).toISOString(),
                action: 'Login Attempt',
                details: 'Failed login attempt for user unknown@test.com',
                user: 'System',
                type: 'warning'
            }
        ];
        
        displaySystemLogs(logs);
        
    } catch (error) {
        console.error('Failed to load system logs:', error);
        showNotification('Failed to load system logs', 'error');
    }
}

function displaySystemLogs(logs) {
    const container = document.getElementById('systemLogs');
    
    if (logs.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <i class="fas fa-history text-4xl mb-4"></i>
                <p>No system activity logs found</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = logs.map(log => {
        const typeColors = {
            info: 'bg-blue-50 border-blue-200 text-blue-800',
            success: 'bg-green-50 border-green-200 text-green-800',
            warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
            error: 'bg-red-50 border-red-200 text-red-800'
        };
        
        const typeIcons = {
            info: 'fa-info-circle',
            success: 'fa-check-circle',
            warning: 'fa-exclamation-triangle',
            error: 'fa-times-circle'
        };
        
        return `
            <div class="${typeColors[log.type]} rounded-lg p-4 border">
                <div class="flex items-start">
                    <i class="fas ${typeIcons[log.type]} mt-1 mr-3"></i>
                    <div class="flex-1">
                        <div class="flex justify-between items-start mb-2">
                            <h4 class="font-semibold">${log.action}</h4>
                            <span class="text-sm opacity-75">${new Date(log.timestamp).toLocaleString()}</span>
                        </div>
                        <p class="text-sm mb-2">${log.details}</p>
                        <p class="text-xs opacity-75">User: ${log.user}</p>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function refreshLogs() {
    loadSystemLogs();
    showNotification('System logs refreshed', 'success');
}

// Profile Management
async function loadProfile() {
    try {
        const userRole = localStorage.getItem('userRole');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        displayProfile(user, userRole);
        
    } catch (error) {
        console.error('Failed to load profile:', error);
        showNotification('Failed to load profile', 'error');
    }
}

function displayProfile(user, userRole) {
    const container = document.getElementById('profileContent');
    
    let profileFields = '';
    
    switch (userRole) {
        case 'ADMIN':
            profileFields = `
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Admin ID</label>
                        <input type="text" value="${user.adminId || 'admin'}" class="form-input w-full" readonly>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Username</label>
                        <input type="text" value="${user.username || 'admin'}" class="form-input w-full" readonly>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                        <input type="text" id="firstName" value="${user.firstName || 'System'}" class="form-input w-full">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                        <input type="text" id="lastName" value="${user.lastName || 'Administrator'}" class="form-input w-full">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input type="email" id="email" value="${user.email || 'admin@mis.edu'}" class="form-input w-full">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <input type="tel" id="phone" value="${user.phone || '+1-555-0100'}" class="form-input w-full">
                    </div>
                </div>
            `;
            break;
            
        case 'LECTURER':
            profileFields = `
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
                        <input type="text" value="${user.employeeId || user.lecturerId || 'EMP001'}" class="form-input w-full" readonly>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Department</label>
                        <input type="text" id="department" value="${user.department || 'Computer Science'}" class="form-input w-full">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                        <input type="text" id="firstName" value="${user.firstName || 'John'}" class="form-input w-full">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                        <input type="text" id="lastName" value="${user.lastName || 'Doe'}" class="form-input w-full">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input type="email" id="email" value="${user.email || 'john.doe@test.com'}" class="form-input w-full">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <input type="tel" id="phone" value="${user.phone || '+1-555-0101'}" class="form-input w-full">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Office</label>
                        <input type="text" id="office" value="${user.office || 'Room 201'}" class="form-input w-full">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                        <input type="text" id="specialization" value="${user.specialization || 'Software Engineering'}" class="form-input w-full">
                    </div>
                </div>
            `;
            break;
            
        case 'STUDENT':
            profileFields = `
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Student ID</label>
                        <input type="text" value="${user.studentId || 'STU001'}" class="form-input w-full" readonly>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Program</label>
                        <input type="text" id="program" value="${user.program || 'Computer Engineering'}" class="form-input w-full">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                        <input type="text" id="firstName" value="${user.firstName || 'Student'}" class="form-input w-full">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                        <input type="text" id="lastName" value="${user.lastName || 'User'}" class="form-input w-full">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input type="email" id="email" value="${user.email || 'student@test.com'}" class="form-input w-full">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <input type="tel" id="phone" value="${user.phone || '+1-555-0102'}" class="form-input w-full">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Year</label>
                        <select id="year" class="form-select w-full">
                            <option value="1" ${user.year === '1' ? 'selected' : ''}>1st Year</option>
                            <option value="2" ${user.year === '2' ? 'selected' : ''}>2nd Year</option>
                            <option value="3" ${user.year === '3' ? 'selected' : ''}>3rd Year</option>
                            <option value="4" ${user.year === '4' ? 'selected' : ''}>4th Year</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                        <input type="date" id="dateOfBirth" value="${user.dateOfBirth || '2000-01-01'}" class="form-input w-full">
                    </div>
                </div>
            `;
            break;
    }
    
    container.innerHTML = `
        <div class="mb-6">
            <div class="flex items-center mb-4">
                <div class="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mr-4">
                    <i class="fas ${
                        userRole === 'ADMIN' ? 'fa-user-shield' :
                        userRole === 'LECTURER' ? 'fa-chalkboard-teacher' :
                        'fa-user-graduate'
                    } text-white text-2xl"></i>
                </div>
                <div>
                    <h3 class="text-xl font-bold text-gray-900">${user.firstName || 'User'} ${user.lastName || ''}</h3>
                    <p class="text-gray-600">${userRole.charAt(0) + userRole.slice(1).toLowerCase()}</p>
                </div>
            </div>
        </div>
        
        <form id="profileForm">
            ${profileFields}
            
            <div class="mt-8 flex justify-end space-x-3">
                <button type="button" onclick="cancelProfileEdit()" class="btn-glass">Cancel</button>
                <button type="submit" class="btn-glass bg-green-600 text-white hover:bg-green-700">
                    <i class="fas fa-save mr-2"></i>Save Changes
                </button>
            </div>
        </form>
    `;
    
    // Add form submit handler
    document.getElementById('profileForm').addEventListener('submit', handleProfileUpdate);
}

async function handleProfileUpdate(e) {
    e.preventDefault();
    
    try {
        showLoading(true);
        
        // Collect form data
        const formData = new FormData(e.target);
        const updatedProfile = {};
        
        // Get all input fields
        const inputs = e.target.querySelectorAll('input, select');
        inputs.forEach(input => {
            if (input.id && !input.readOnly) {
                updatedProfile[input.id] = input.value;
            }
        });
        
        // Update localStorage with new profile data
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = { ...currentUser, ...updatedProfile };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // In a real implementation, you would send this to the backend
        // await api.updateProfile(updatedProfile);
        
        showNotification('Profile updated successfully', 'success');
        
    } catch (error) {
        console.error('Failed to update profile:', error);
        showNotification('Failed to update profile', 'error');
    } finally {
        showLoading(false);
    }
}

function editProfile() {
    showNotification('Profile editing is now available in the form above', 'info');
}

function cancelProfileEdit() {
    loadProfile(); // Reload original data
    showNotification('Profile changes cancelled', 'info');
}
