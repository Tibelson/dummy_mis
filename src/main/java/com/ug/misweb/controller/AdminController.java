package com.ug.misweb.controller;

import com.ug.misweb.dto.CourseDTO;
import com.ug.misweb.dto.StudentDTO;
import com.ug.misweb.dto.EnrollmentDTO;
import com.ug.misweb.dto.LecturerDTO;
import com.ug.misweb.service.CourseService;
import com.ug.misweb.service.StudentService;
import com.ug.misweb.service.LecturerService;
import com.ug.misweb.service.EnrollmentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {
    
    @Autowired
    private StudentService studentService;
    
    @Autowired
    private CourseService courseService;
    
    @Autowired
    private LecturerService lecturerService;
    
    @Autowired
    private EnrollmentService enrollmentService;
    
    // Dashboard Statistics
    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        long totalStudents = studentService.getTotalStudents();
        long totalCourses = courseService.getTotalCourses();
        long totalLecturers = lecturerService.getTotalLecturers();
        long totalEnrollments = enrollmentService.getTotalEnrollments();
        
        Map<String, Object> stats = Map.of(
            "totalStudents", totalStudents,
            "totalCourses", totalCourses,
            "totalLecturers", totalLecturers,
            "totalEnrollments", totalEnrollments
        );
        return ResponseEntity.ok(stats);
    }
    
    // Student Management
    @PostMapping("/students")
    public ResponseEntity<StudentDTO> createStudent(@Valid @RequestBody StudentDTO studentDTO) {
        StudentDTO createdStudent = studentService.createStudent(studentDTO);
        return ResponseEntity.ok(createdStudent);
    }
    
    @PutMapping("/students/{id}")
    public ResponseEntity<StudentDTO> updateStudent(@PathVariable Long id, @Valid @RequestBody StudentDTO studentDTO) {
        StudentDTO updatedStudent = studentService.updateStudent(id, studentDTO);
        return ResponseEntity.ok(updatedStudent);
    }
    
    @DeleteMapping("/students/{id}")
    public ResponseEntity<Map<String, String>> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.ok(Map.of("message", "Student deleted successfully"));
    }
    
    // Course Management
    @PostMapping("/courses")
    public ResponseEntity<CourseDTO> createCourse(@Valid @RequestBody CourseDTO courseDTO) {
        CourseDTO createdCourse = courseService.createCourse(courseDTO);
        return ResponseEntity.ok(createdCourse);
    }
    
    @PutMapping("/courses/{id}")
    public ResponseEntity<CourseDTO> updateCourse(@PathVariable Long id, @Valid @RequestBody CourseDTO courseDTO) {
        CourseDTO updatedCourse = courseService.updateCourse(id, courseDTO);
        return ResponseEntity.ok(updatedCourse);
    }
    
    @DeleteMapping("/courses/{id}")
    public ResponseEntity<Map<String, String>> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.ok(Map.of("message", "Course deleted successfully"));
    }
    
    @PutMapping("/courses/{courseId}/assign-lecturer/{lecturerId}")
    public ResponseEntity<CourseDTO> assignLecturerToCourse(@PathVariable Long courseId, @PathVariable Long lecturerId) {
        CourseDTO course = courseService.assignLecturerToCourse(courseId, lecturerId);
        return ResponseEntity.ok(course);
    }
    
    // Lecturer Management
    @PostMapping("/lecturers")
    public ResponseEntity<LecturerDTO> createLecturer(@Valid @RequestBody LecturerDTO lecturerDTO) {
        LecturerDTO createdLecturer = lecturerService.createLecturer(lecturerDTO);
        return ResponseEntity.ok(createdLecturer);
    }
    
    @PutMapping("/lecturers/{id}")
    public ResponseEntity<LecturerDTO> updateLecturer(@PathVariable Long id, @Valid @RequestBody LecturerDTO lecturerDTO) {
        LecturerDTO updatedLecturer = lecturerService.updateLecturer(id, lecturerDTO);
        return ResponseEntity.ok(updatedLecturer);
    }
    
    @DeleteMapping("/lecturers/{id}")
    public ResponseEntity<Map<String, String>> deleteLecturer(@PathVariable Long id) {
        lecturerService.deleteLecturer(id);
        return ResponseEntity.ok(Map.of("message", "Lecturer deleted successfully"));
    }
    
    // Enrollment Management
    @PostMapping("/enrollments")
    public ResponseEntity<EnrollmentDTO> manuallyEnrollStudent(
            @RequestParam Long studentId,
            @RequestParam Long courseId) {
        EnrollmentDTO enrollment = enrollmentService.enrollStudent(studentId, courseId);
        return ResponseEntity.ok(enrollment);
    }
    
    @DeleteMapping("/enrollments/{enrollmentId}")
    public ResponseEntity<Map<String, String>> removeEnrollment(@PathVariable Long enrollmentId) {
        enrollmentService.removeEnrollment(enrollmentId);
        return ResponseEntity.ok(Map.of("message", "Enrollment removed successfully"));
    }
    
    @PutMapping("/enrollments/{enrollmentId}/grade")
    public ResponseEntity<Map<String, String>> assignGrade(@PathVariable Long enrollmentId, @RequestParam String grade) {
        enrollmentService.assignGrade(enrollmentId, grade);
        return ResponseEntity.ok(Map.of("message", "Grade assigned successfully"));
    }
} 