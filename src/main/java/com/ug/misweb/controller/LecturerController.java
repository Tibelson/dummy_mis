package com.ug.misweb.controller;

import com.ug.misweb.model.Lecturer;
import com.ug.misweb.model.Enrollment;
import com.ug.misweb.service.LecturerService;
import com.ug.misweb.service.EnrollmentService;
import com.ug.misweb.repository.EnrollmentRepository;
import com.ug.misweb.exception.ResourceNotFoundException;
import com.ug.misweb.exception.DuplicateResourceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/lecturers")
@CrossOrigin(origins = "*")
public class LecturerController {
    
    @Autowired
    private LecturerService lecturerService;
    
    @Autowired
    private EnrollmentService enrollmentService;
    
    @Autowired
    private EnrollmentRepository enrollmentRepository;
    
    // Get all lecturers (Admin only)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Lecturer>> getAllLecturers() {
        List<Lecturer> lecturers = lecturerService.getActiveLecturers();
        return ResponseEntity.ok(lecturers);
    }
    
    // Get lecturers by department
    @GetMapping("/department/{department}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Lecturer>> getLecturersByDepartment(@PathVariable String department) {
        List<Lecturer> lecturers = lecturerService.getLecturersByDepartment(department);
        return ResponseEntity.ok(lecturers);
    }
    
    // Get lecturer by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LECTURER')")
    public ResponseEntity<Lecturer> getLecturerById(@PathVariable Long id) {
        try {
            Lecturer lecturer = lecturerService.getLecturerById(id);
            return ResponseEntity.ok(lecturer);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Create new lecturer (Admin only)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createLecturer(@RequestBody Lecturer lecturer) {
        try {
            Lecturer createdLecturer = lecturerService.createLecturer(lecturer);
            return ResponseEntity.ok(createdLecturer);
        } catch (DuplicateResourceException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    // Update lecturer
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('LECTURER') and #id == authentication.principal.id)")
    public ResponseEntity<?> updateLecturer(@PathVariable Long id, @RequestBody Lecturer lecturerDetails) {
        try {
            Lecturer updatedLecturer = lecturerService.updateLecturer(id, lecturerDetails);
            return ResponseEntity.ok(updatedLecturer);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (DuplicateResourceException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    // Delete lecturer (Admin only)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteLecturer(@PathVariable Long id) {
        try {
            lecturerService.deleteLecturer(id);
            return ResponseEntity.ok().body(Map.of("message", "Lecturer deleted successfully"));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Get courses taught by lecturer
    @GetMapping("/{id}/courses")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('LECTURER') and #id == authentication.principal.id)")
    public ResponseEntity<?> getLecturerCourses(@PathVariable Long id) {
        try {
            Lecturer lecturer = lecturerService.getLecturerById(id);
            return ResponseEntity.ok(lecturer.getCourses());
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Get enrollments for a course taught by lecturer
    @GetMapping("/{lecturerId}/courses/{courseId}/enrollments")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('LECTURER') and #lecturerId == authentication.principal.id)")
    public ResponseEntity<?> getCourseEnrollments(@PathVariable Long lecturerId, @PathVariable Long courseId) {
        try {
            // Verify lecturer teaches this course
            Lecturer lecturer = lecturerService.getLecturerById(lecturerId);
            boolean teachesCourse = lecturer.getCourses().stream()
                    .anyMatch(course -> course.getId().equals(courseId));
            
            if (!teachesCourse) {
                return ResponseEntity.status(403).body(Map.of("error", "You don't teach this course"));
            }
            
            // Get enrollments for the course
            List<Enrollment> enrollments = enrollmentRepository.findByCourseId(courseId);
            return ResponseEntity.ok(enrollments);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Assign grade to student enrollment
    @PutMapping("/{lecturerId}/enrollments/{enrollmentId}/grade")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('LECTURER') and #lecturerId == authentication.principal.id)")
    public ResponseEntity<?> assignGrade(@PathVariable Long lecturerId, 
                                       @PathVariable Long enrollmentId,
                                       @RequestBody Map<String, String> request) {
        try {
            String grade = request.get("grade");
            if (grade == null || grade.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Grade is required"));
            }
            
            // Verify lecturer teaches this course
            Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                    .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found"));
            Lecturer lecturer = lecturerService.getLecturerById(lecturerId);
            
            boolean teachesCourse = lecturer.getCourses().stream()
                    .anyMatch(course -> course.getId().equals(enrollment.getCourse().getId()));
            
            if (!teachesCourse) {
                return ResponseEntity.status(403).body(Map.of("error", "You don't teach this course"));
            }
            
            enrollmentService.assignGrade(enrollmentId, grade);
            return ResponseEntity.ok(Map.of("message", "Grade assigned successfully"));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Change password
    @PutMapping("/{id}/password")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('LECTURER') and #id == authentication.principal.id)")
    public ResponseEntity<?> changePassword(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            String newPassword = request.get("newPassword");
            if (newPassword == null || newPassword.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "New password is required"));
            }
            
            lecturerService.changePassword(id, newPassword);
            return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
} 