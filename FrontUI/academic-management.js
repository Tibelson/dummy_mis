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
        const token = localStorage.getItem('authToken');
        const userRole = localStorage.getItem('userRole');
        
        if (!token) {
            window.location.href = 'home-new.html';
            return;
        }
        
        authToken = token;
        
        // Set user role display
        document.getElementById('userRole').textContent = userRole || 'User';
        
        // Show admin tab for admin users
        if (userRole === 'ADMIN') {
            document.getElementById('adminTab').style.display = 'block';
        }
        
        // Load initial data
        await loadDashboardStats();
        await loadEnrollments();
        await loadDropdownData();
        
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
                const enrollments = await api.getEnrollments(student.id);
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
                const enrollments = await api.getEnrollments(student.id);
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
        await api.enrollStudent(studentId, courseId);
        showNotification('Student enrolled successfully', 'success');
        closeModal('enrollModal');
        loadEnrollments();
        loadDashboardStats();
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
    
    try {
        showLoading(true);
        await api.assignGradeAdmin(currentEnrollmentId, grade);
        showNotification('Grade assigned successfully', 'success');
        closeModal('gradeModal');
        loadGrades();
        loadEnrollments();
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
    window.location.href = 'dashboard-modern.html';
}

function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('currentUser');
    window.location.href = 'home-new.html';
}

// Refresh functions
function refreshGrades() {
    loadGrades();
}

// Placeholder functions for admin management
function showCreateStudentModal() {
    showNotification('Student creation modal - Coming soon!', 'info');
}

function showCreateCourseModal() {
    showNotification('Course creation modal - Coming soon!', 'info');
}

function showCreateLecturerModal() {
    showNotification('Lecturer creation modal - Coming soon!', 'info');
}

function loadStudents() {
    showNotification('Student list view - Coming soon!', 'info');
}

function loadCourses() {
    showNotification('Course list view - Coming soon!', 'info');
}

function loadLecturers() {
    showNotification('Lecturer list view - Coming soon!', 'info');
}
