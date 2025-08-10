package com.ug.misweb.controller;

import com.ug.misweb.dto.EnrollmentDTO;
import com.ug.misweb.dto.StudentDTO;
import com.ug.misweb.service.EnrollmentService;
import com.ug.misweb.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*")
public class StudentController {

    private final StudentService studentService;
    private final EnrollmentService enrollmentService;

    public StudentController(StudentService studentService, EnrollmentService enrollmentService) {
        this.studentService = studentService;
        this.enrollmentService = enrollmentService;
    }

    @GetMapping
    public ResponseEntity<List<StudentDTO>> getAllStudents() {
        List<StudentDTO> students = studentService.getAllStudents();
        return ResponseEntity.ok(students);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentDTO> getStudentById(@PathVariable Long id) {
        // Service throws ResourceNotFoundException if not found → handled globally
        StudentDTO student = studentService.getStudentById(id);
        return ResponseEntity.ok(student);
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentDTO> updateStudent(@PathVariable Long id, @Valid @RequestBody StudentDTO studentDTO) {
        StudentDTO updatedStudent = studentService.updateStudent(id, studentDTO);
        return ResponseEntity.ok(updatedStudent);
    }

    @GetMapping("/{studentId}/enrollments")
    public ResponseEntity<List<EnrollmentDTO>> getStudentEnrollments(@PathVariable Long studentId) {
        List<EnrollmentDTO> enrollments = enrollmentService.getStudentEnrollments(studentId);
        return ResponseEntity.ok(enrollments);
    }

    @PostMapping("/{studentId}/enrollments")
    public ResponseEntity<EnrollmentDTO> enrollStudent(
            @PathVariable Long studentId,
            @RequestParam Long courseId
    ) {
        EnrollmentDTO enrollment = enrollmentService.enrollStudent(studentId, courseId);
        return ResponseEntity.ok(enrollment);
    }

    @DeleteMapping("/{studentId}/enrollments/{enrollmentId}")
    public ResponseEntity<String> dropCourse(@PathVariable Long studentId, @PathVariable Long enrollmentId) {
        boolean dropped = enrollmentService.dropCourse(studentId, enrollmentId);
        if (dropped) {
            return ResponseEntity.ok("Course dropped successfully");
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/{studentId}/grades")
    public ResponseEntity<List<EnrollmentDTO>> getStudentGrades(@PathVariable Long studentId) {
        List<EnrollmentDTO> grades = enrollmentService.getStudentGrades(studentId);
        return ResponseEntity.ok(grades);
    }
}
