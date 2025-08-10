// Modern Dashboard JavaScript
class Dashboard {
    constructor() {
        this.currentUser = null;
        this.currentRole = localStorage.getItem('userRole') || null;
        this.authToken = localStorage.getItem('authToken') || null;
        this.API_BASE_URL = 'http://localhost:8080/api';
        
        this.init();
    }

    async init() {
        await this.loadUserData();
        this.setupNavigation();
        this.setupEventListeners();
        this.loadDashboardData();
    }

    async loadUserData() {
        try {
            if (this.authToken) {
                // In a real app, fetch user data from API
                this.currentUser = {
                    id: 1,
                    name: this.currentRole === 'admin' ? 'Administrator' : 
                          this.currentRole === 'lecturer' ? 'Dr. Smith' : 'John Doe',
                    email: `${this.currentRole}@university.edu`,
                    role: this.currentRole
                };
            }
        } catch (error) {
            console.error('Failed to load user data:', error);
        }
    }

    setupNavigation() {
        const navMenu = document.getElementById('navMenu');
        const userName = document.getElementById('userName');
        
        if (userName && this.currentUser) {
            userName.textContent = this.currentUser.name;
        }

        if (!navMenu) return;

        let navItems = [];
        
        if (this.currentRole === 'student') {
            navItems = [
                { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-home' },
                { id: 'courses', label: 'My Courses', icon: 'fas fa-book' },
                { id: 'grades', label: 'Grades', icon: 'fas fa-star' }
            ];
        } else if (this.currentRole === 'lecturer') {
            navItems = [
                { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-home' },
                { id: 'courses', label: 'My Courses', icon: 'fas fa-book' },
                { id: 'students', label: 'Students', icon: 'fas fa-users' },
                { id: 'grades', label: 'Grade Management', icon: 'fas fa-graduation-cap' }
            ];
        } else if (this.currentRole === 'admin') {
            navItems = [
                { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-home' },
                { id: 'users', label: 'Users', icon: 'fas fa-users' },
                { id: 'courses', label: 'Courses', icon: 'fas fa-book' },
                { id: 'analytics', label: 'Analytics', icon: 'fas fa-chart-bar' }
            ];
        }

        navMenu.innerHTML = navItems.map(item => `
            <a href="#" class="nav-link-modern" data-section="${item.id}">
                <i class="${item.icon}"></i>
                ${item.label}
            </a>
        `).join('');

        // Set first item as active
        if (navItems.length > 0) {
            navMenu.querySelector('.nav-link-modern').classList.add('active');
        }
    }

    setupEventListeners() {
        // Navigation links
        document.addEventListener('click', (e) => {
            if (e.target.matches('.nav-link-modern') || e.target.closest('.nav-link-modern')) {
                e.preventDefault();
                const link = e.target.closest('.nav-link-modern');
                const section = link.dataset.section;
                this.showSection(section);
                
                // Update active state
                document.querySelectorAll('.nav-link-modern').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.user-menu')) {
                document.getElementById('userDropdown')?.classList.add('hidden');
            }
        });
    }

    async loadDashboardData() {
        try {
            this.showLoading();
            
            // Update welcome message
            this.updateWelcomeSection();
            
            // Load stats
            await this.loadStats();
            
            // Load main content based on role
            await this.loadMainContent();
            
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
            this.showToast('Failed to load dashboard data', 'error');
        } finally {
            this.hideLoading();
        }
    }

    updateWelcomeSection() {
        const welcomeTitle = document.getElementById('welcomeTitle');
        const welcomeSubtitle = document.getElementById('welcomeSubtitle');
        
        if (welcomeTitle && this.currentUser) {
            const timeOfDay = this.getTimeOfDay();
            welcomeTitle.textContent = `Good ${timeOfDay}, ${this.currentUser.name}!`;
        }
        
        if (welcomeSubtitle) {
            const messages = {
                student: "Here's your academic progress and upcoming assignments.",
                lecturer: "Manage your courses and track student progress.",
                admin: "Monitor system activity and manage users."
            };
            welcomeSubtitle.textContent = messages[this.currentRole] || "Welcome to your dashboard.";
        }
    }

    getTimeOfDay() {
        const hour = new Date().getHours();
        if (hour < 12) return 'morning';
        if (hour < 17) return 'afternoon';
        return 'evening';
    }

    async loadStats() {
        const statsGrid = document.getElementById('statsGrid');
        if (!statsGrid) return;

        let stats = [];
        
        if (this.currentRole === 'student') {
            stats = [
                { title: 'Enrolled Courses', value: '6', icon: 'fas fa-book', type: 'primary', change: '+2 this semester' },
                { title: 'Average Grade', value: '85%', icon: 'fas fa-star', type: 'success', change: '+5% from last semester' },
                { title: 'Assignments Due', value: '3', icon: 'fas fa-clock', type: 'warning', change: 'Due this week' }
            ];
        } else if (this.currentRole === 'lecturer') {
            stats = [
                { title: 'My Courses', value: '4', icon: 'fas fa-chalkboard-teacher', type: 'primary', change: 'Active courses' },
                { title: 'Total Students', value: '156', icon: 'fas fa-users', type: 'success', change: '+12 new enrollments' },
                { title: 'Pending Grades', value: '23', icon: 'fas fa-graduation-cap', type: 'warning', change: 'Need attention' }
            ];
        } else if (this.currentRole === 'admin') {
            stats = [
                { title: 'Total Users', value: '1,234', icon: 'fas fa-users', type: 'primary', change: '+45 this month' },
                { title: 'Active Courses', value: '89', icon: 'fas fa-book', type: 'success', change: '+7 new courses' },
                { title: 'System Health', value: '99.9%', icon: 'fas fa-server', type: 'success', change: 'Excellent uptime' }
            ];
        }

        statsGrid.innerHTML = stats.map(stat => `
            <div class="stat-card">
                <div class="stat-header">
                    <h3 class="stat-title">${stat.title}</h3>
                    <div class="stat-icon ${stat.type}">
                        <i class="${stat.icon}"></i>
                    </div>
                </div>
                <div class="stat-number">${stat.value}</div>
                <div class="stat-change ${stat.change.includes('+') ? 'positive' : ''}">${stat.change}</div>
            </div>
        `).join('');
    }

    async loadMainContent() {
        // Show the appropriate dashboard section
        this.showSection('dashboard');
        
        if (this.currentRole === 'student') {
            await this.loadStudentCourses();
        } else if (this.currentRole === 'lecturer') {
            await this.loadLecturerCourses();
        } else if (this.currentRole === 'admin') {
            // Admin dashboard is already loaded in HTML
        }
    }

    async loadStudentCourses() {
        const coursesGrid = document.getElementById('studentCourses');
        if (!coursesGrid) return;

        // Mock data - replace with actual API call
        const courses = [
            {
                id: 1,
                code: 'CS101',
                title: 'Introduction to Computer Science',
                description: 'Fundamental concepts of programming and computer science.',
                instructor: 'Dr. Smith',
                credits: 3,
                enrolled: 45,
                grade: 'A-'
            },
            {
                id: 2,
                code: 'MATH201',
                title: 'Calculus II',
                description: 'Advanced calculus including integration techniques.',
                instructor: 'Prof. Johnson',
                credits: 4,
                enrolled: 32,
                grade: 'B+'
            },
            {
                id: 3,
                code: 'PHYS101',
                title: 'Physics I',
                description: 'Classical mechanics and thermodynamics.',
                instructor: 'Dr. Brown',
                credits: 4,
                enrolled: 28,
                grade: 'A'
            }
        ];

        coursesGrid.innerHTML = courses.map(course => `
            <div class="course-card" onclick="dashboard.viewCourse(${course.id})">
                <div class="course-header">
                    <span class="course-code">${course.code}</span>
                    <div class="course-grade" style="background: ${this.getGradeColor(course.grade)}; color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; font-weight: 600;">
                        ${course.grade}
                    </div>
                </div>
                <h3 class="course-title">${course.title}</h3>
                <p class="course-description">${course.description}</p>
                <div class="course-meta">
                    <span><i class="fas fa-user"></i> ${course.instructor}</span>
                    <span><i class="fas fa-credit-card"></i> ${course.credits} credits</span>
                    <span><i class="fas fa-users"></i> ${course.enrolled} students</span>
                </div>
            </div>
        `).join('');
    }

    async loadLecturerCourses() {
        const coursesGrid = document.getElementById('lecturerCourses');
        if (!coursesGrid) return;

        // Mock data - replace with actual API call
        const courses = [
            {
                id: 1,
                code: 'CS101',
                title: 'Introduction to Computer Science',
                description: 'Fundamental concepts of programming and computer science.',
                students: 45,
                credits: 3,
                schedule: 'MWF 10:00-11:00'
            },
            {
                id: 2,
                code: 'CS301',
                title: 'Data Structures and Algorithms',
                description: 'Advanced data structures and algorithmic problem solving.',
                students: 32,
                credits: 4,
                schedule: 'TTh 14:00-15:30'
            }
        ];

        coursesGrid.innerHTML = courses.map(course => `
            <div class="course-card" onclick="dashboard.manageCourse(${course.id})">
                <div class="course-header">
                    <span class="course-code">${course.code}</span>
                </div>
                <h3 class="course-title">${course.title}</h3>
                <p class="course-description">${course.description}</p>
                <div class="course-meta">
                    <span><i class="fas fa-users"></i> ${course.students} students</span>
                    <span><i class="fas fa-credit-card"></i> ${course.credits} credits</span>
                    <span><i class="fas fa-clock"></i> ${course.schedule}</span>
                </div>
            </div>
        `).join('');
    }

    getGradeColor(grade) {
        const gradeColors = {
            'A': '#10b981', 'A-': '#10b981',
            'B+': '#3b82f6', 'B': '#3b82f6', 'B-': '#3b82f6',
            'C+': '#f59e0b', 'C': '#f59e0b', 'C-': '#f59e0b',
            'D': '#ef4444', 'F': '#ef4444'
        };
        return gradeColors[grade] || '#6b7280';
    }

    showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.add('hidden');
        });

        // Show the requested section
        const section = document.getElementById(`${sectionId}Dashboard`);
        if (section) {
            section.classList.remove('hidden');
        }
    }

    viewCourse(courseId) {
        this.showToast(`Viewing course ${courseId}`, 'info');
        // Implement course view functionality
    }

    manageCourse(courseId) {
        this.showToast(`Managing course ${courseId}`, 'info');
        // Implement course management functionality
    }

    showLoading() {
        document.getElementById('loadingOverlay')?.classList.remove('hidden');
    }

    hideLoading() {
        document.getElementById('loadingOverlay')?.classList.add('hidden');
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${this.getToastIcon(type)} mr-2"></i>
                ${message}
            </div>
        `;
        
        const container = document.getElementById('toastContainer');
        if (container) {
            container.appendChild(toast);
            
            setTimeout(() => toast.classList.add('show'), 100);
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }
    }

    getToastIcon(type) {
        const icons = {
            info: 'info-circle',
            success: 'check-circle',
            warning: 'exclamation-triangle',
            error: 'exclamation-circle'
        };
        return icons[type] || 'info-circle';
    }

    refreshData() {
        this.showToast('Refreshing data...', 'info');
        this.loadDashboardData();
    }

    logout() {
        localStorage.removeItem('userRole');
        localStorage.removeItem('authToken');
        localStorage.removeItem('isLoggedIn');
        window.location.href = 'home-new.html';
    }
}

// Global functions
window.toggleUserMenu = function() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.classList.toggle('hidden');
    }
};

window.refreshData = function() {
    if (window.dashboard) {
        window.dashboard.refreshData();
    }
};

window.logout = function() {
    if (window.dashboard) {
        window.dashboard.logout();
    }
};

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new Dashboard();
});
