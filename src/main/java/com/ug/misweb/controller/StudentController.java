package com.ug.misweb.controller;

import com.ug.misweb.dto.EnrollmentDTO;
import com.ug.misweb.dto.StudentDTO;
import com.ug.misweb.model.Enrollment;
import com.ug.misweb.service.EnrollmentService;
import com.ug.misweb.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {
    
    @Autowired
    private StudentService studentService;
    
    @Autowired
    private EnrollmentService enrollmentService;
    
    @GetMapping("/{id}")
    // @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<StudentDTO> getStudentById(@PathVariable Long id) {
        StudentDTO student = studentService.getStudentById(id);
        return ResponseEntity.ok(student);
    }
    
    @PutMapping("/{id}")
    // @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<StudentDTO> updateStudent(@PathVariable Long id, @Valid @RequestBody StudentDTO studentDTO) {
        StudentDTO updatedStudent = studentService.updateStudent(id, studentDTO);
        return ResponseEntity.ok(updatedStudent);
    }
    
    @GetMapping("/{studentId}/enrollments")
    // @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<List<EnrollmentDTO>> getStudentEnrollments(@PathVariable Long studentId) {
        List<EnrollmentDTO> enrollments = enrollmentService.getStudentEnrollments(studentId);
        return ResponseEntity.ok(enrollments);
    }
    
    @PostMapping("/{studentId}/enrollments")
    // @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<EnrollmentDTO> enrollStudent(@PathVariable Long studentId, @RequestParam Long courseId) {
        EnrollmentDTO enrollment = enrollmentService.enrollStudent(studentId, courseId);
        return ResponseEntity.ok(enrollment);
    }
    
    @DeleteMapping("/{studentId}/enrollments/{enrollmentId}")
    // @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<String> dropCourse(@PathVariable Long studentId, @PathVariable Long enrollmentId) {
        enrollmentService.dropCourse(studentId, enrollmentId);
        return ResponseEntity.ok("Course dropped successfully");
    }
    
    @GetMapping("/{studentId}/grades")
    // @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<List<EnrollmentDTO>> getStudentGrades(@PathVariable Long studentId) {
        List<EnrollmentDTO> grades = enrollmentService.getStudentGrades(studentId);
        return ResponseEntity.ok(grades);
    }
} 