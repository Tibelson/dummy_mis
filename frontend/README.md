# MIS Web Frontend

A modern, responsive frontend application for the MIS Web Student Management System built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

### Core Functionality
- **Authentication System**: Login and registration with JWT tokens
- **Student Dashboard**: View enrollments, grades, and academic progress
- **Course Management**: Browse and enroll in courses
- **Admin Panel**: Comprehensive administrative tools
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

### User Roles
- **Students**: View courses, enroll, check grades, manage profile
- **Administrators**: Manage students, courses, enrollments, and grades

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **HTTP Client**: Axios for API communication
- **UI Components**: Custom component library with Lucide React icons
- **Forms**: React Hook Form for form management
- **Notifications**: React Hot Toast for user feedback
- **Date Handling**: date-fns for date formatting

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── admin/             # Admin pages
│   │   ├── courses/           # Course-related pages
│   │   ├── login/             # Authentication pages
│   │   ├── register/          # Registration page
│   │   ├── student/           # Student dashboard
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/
│   │   └── ui/               # Reusable UI components
│   └── lib/
│       ├── api.ts            # API configuration and services
│       └── utils.ts          # Utility functions
├── public/                   # Static assets
├── package.json
├── tailwind.config.ts
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend server running on `http://localhost:8080`

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backEnd/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Environment Variables

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## 📱 Available Pages

### Public Pages
- **Home** (`/`): Main dashboard with overview
- **Login** (`/login`): User authentication
- **Register** (`/register`): Student registration
- **Courses** (`/courses`): Browse available courses
- **Course Details** (`/courses/[id]`): Individual course information

### Student Pages
- **Student Dashboard** (`/student`): Personal academic overview
- **Student Profile** (`/student/profile`): Profile management
- **Enrollments** (`/student/enrollments`): Course enrollments
- **Grades** (`/student/grades`): Academic performance

### Admin Pages
- **Admin Dashboard** (`/admin`): Administrative overview
- **Add Student** (`/admin/students/new`): Create new student accounts
- **Add Course** (`/admin/courses/new`): Create new courses
- **Manage Enrollments** (`/admin/enrollments`): Enrollment management

## 🔧 API Integration

The frontend integrates with the MIS Web backend through the following services:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Student registration
- `GET /api/auth/me` - Get current user

### Courses
- `GET /api/courses` - List all courses
- `GET /api/courses/{id}` - Get course details
- `POST /api/admin/courses` - Create course (admin)
- `PUT /api/admin/courses/{id}` - Update course (admin)

### Students
- `GET /api/students/{id}` - Get student details
- `PUT /api/students/{id}` - Update student
- `POST /api/admin/students` - Create student (admin)
- `PUT /api/admin/students/{id}` - Update student (admin)

### Enrollments
- `GET /api/students/{id}/enrollments` - Get student enrollments
- `POST /api/students/{id}/enrollments` - Enroll in course
- `DELETE /api/students/{id}/enrollments/{enrollmentId}` - Drop course
- `GET /api/students/{id}/grades` - Get student grades
- `PUT /api/admin/enrollments/{enrollmentId}/grade` - Assign grade (admin)

## 🎨 Design System

The application uses a custom design system built with Tailwind CSS:

### Colors
- **Primary**: Blue (#3B82F6)
- **Secondary**: Gray (#6B7280)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)

### Components
- **Button**: Multiple variants (primary, secondary, outline, destructive)
- **Input**: Form inputs with validation states
- **Card**: Content containers with headers and actions
- **Modal**: Overlay dialogs for confirmations

## 🔐 Authentication

The application uses JWT tokens for authentication:

1. **Login**: Users authenticate with username/password
2. **Token Storage**: JWT tokens stored in localStorage
3. **Auto-logout**: Tokens expire after 24 hours
4. **Protected Routes**: Admin routes require admin role

### Demo Credentials
- **Admin**: username: `admin`, password: `admin123`
- **Student**: Use admission number as username

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Setup
- Set `NEXT_PUBLIC_API_URL` to your production API endpoint
- Configure CORS on the backend for your frontend domain

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend CORS is configured for frontend domain
2. **API Connection**: Verify backend is running on correct port
3. **Build Errors**: Check Node.js version compatibility
4. **Styling Issues**: Ensure Tailwind CSS is properly configured

### Development Tips

- Use browser dev tools to inspect API requests
- Check console for error messages
- Verify environment variables are set correctly
- Test on different screen sizes for responsiveness

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of the MIS Web Student Management System.

## 🆘 Support

For support and questions:
- Check the backend documentation
- Review API endpoint testing guide
- Contact the development team
