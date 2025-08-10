# FrontUI Pages

This frontend has been refactored into separate pages per role:

- `home.html` — Role selection landing page
- `student.html` — Student portal (browse/enroll courses, view grades)
- `lecturer.html` — Lecturer portal (view courses, manage students and grades)
- `admin.html` — Admin portal (manage courses, students, lecturers)

Shared modules:
- `api.js` — API client for backend calls

Run locally:

- From `FrontUI/`, run `npm run dev` (uses `serve` on port 3000)
- Open `http://localhost:3000/home.html` 