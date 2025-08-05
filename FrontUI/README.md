# FrontUI - Student Management System Frontend

A modern, responsive frontend for the MIS Web Student Management System built with vanilla JavaScript, HTML, and CSS.

## Features

- **Authentication**: Login/Register functionality with JWT tokens
- **Dashboard**: Overview with statistics and recent activity
- **Course Management**: View, add, edit, and delete courses
- **Student Management**: View, add, edit, and delete students
- **Admin Panel**: Administrative tools and system management
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional interface with animations

## Getting Started

### Prerequisites

1. Make sure the Spring Boot backend is running on `http://localhost:8080`
2. Ensure the database is properly configured and running

### Running the Frontend

1. Open `index.html` in your web browser
2. Or serve it using a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js (if you have http-server installed)
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

3. Navigate to `http://localhost:8000` in your browser

## API Endpoints

The frontend connects to the following backend endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Student registration
- `GET /api/auth/me` - Get current user

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/{id}` - Get course by ID
- `POST /api/admin/courses` - Create new course
- `PUT /api/admin/courses/{id}` - Update course
- `DELETE /api/admin/courses/{id}` - Delete course

### Students
- `GET /api/students` - Get all students
- `GET /api/students/{id}` - Get student by ID
- `POST /api/admin/students` - Create new student
- `PUT /api/admin/students/{id}` - Update student
- `DELETE /api/admin/students/{id}` - Delete student

### Enrollments
- `GET /api/students/{id}/enrollments` - Get student enrollments
- `POST /api/students/{id}/enrollments` - Enroll student in course
- `DELETE /api/students/{id}/enrollments/{enrollmentId}` - Drop enrollment

### Grades
- `GET /api/students/{id}/grades` - Get student grades
- `PUT /api/admin/enrollments/{enrollmentId}/grade` - Assign grade

## Demo Credentials

### Admin User
- Username: `admin`
- Password: `admin123`

### Student Registration
- Students can register using their admission number
- Initial password is the admission number
- Students should change their password after first login

## Features Overview

### Dashboard
- Overview statistics (students, courses, enrollments)
- Recent activity feed
- Quick action buttons

### Courses Section
- Browse all available courses
- Search and filter courses
- Add new courses (admin only)
- View course details

### Students Section
- View all registered students
- Search and filter students
- Add new students (admin only)
- View student details and enrollments

### Admin Panel
- User management tools
- System statistics
- Data export functionality
- Administrative controls

## File Structure

```
FrontUI/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and animations
├── app.js             # JavaScript functionality
└── README.md          # This file
```

## Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Development

### Adding New Features

1. **New API Endpoints**: Add to the `api` object in `app.js`
2. **New UI Components**: Add HTML structure and CSS styles
3. **New Functionality**: Add JavaScript functions and event handlers

### Styling

The application uses Tailwind CSS classes for styling. Custom styles are defined in `styles.css`.

### JavaScript Architecture

- **api**: Handles all API communication
- **ui**: Manages UI updates and interactions
- **auth**: Handles authentication and user management
- **forms**: Manages form submissions
- **navigation**: Handles navigation and routing
- **utils**: Utility functions

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the backend CORS configuration allows requests from the frontend
2. **API Connection**: Verify the backend is running on `http://localhost:8080`
3. **Authentication**: Check that JWT tokens are being properly stored and sent
4. **Database**: Ensure the database is running and accessible

### Debug Mode

Open browser developer tools (F12) to see:
- API request/response logs
- JavaScript errors
- Network activity

## Security Notes

- JWT tokens are stored in localStorage
- API requests include Authorization headers
- Form validation is implemented
- Error handling for failed requests

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the MIS Web Student Management System. 