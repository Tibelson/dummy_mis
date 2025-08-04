package com.ug.misweb.service;

import com.ug.misweb.dto.EnrollmentDTO;
import com.ug.misweb.exception.ResourceNotFoundException;
import com.ug.misweb.model.Course;
import com.ug.misweb.model.Enrollment;
import com.ug.misweb.model.Student;
import com.ug.misweb.repository.CourseRepository;
import com.ug.misweb.repository.EnrollmentRepository;
import com.ug.misweb.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EnrollmentService {
    
    @Autowired
    private EnrollmentRepository enrollmentRepository;
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private CourseRepository courseRepository;
    
    public EnrollmentDTO enrollStudent(Long studentId, Long courseId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        
        // Check if already enrolled
        if (enrollmentRepository.findByStudentIdAndCourseId(studentId, courseId).isPresent()) {
            throw new RuntimeException("Student is already enrolled in this course");
        }
        
        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(student);
        enrollment.setCourse(course);
        enrollment.setEnrollmentDate(LocalDateTime.now());
        
        Enrollment savedEnrollment = enrollmentRepository.save(enrollment);
        return convertToDTO(savedEnrollment);
    }
    
    public List<EnrollmentDTO> getStudentEnrollments(Long studentId) {
        return enrollmentRepository.findByStudentId(studentId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public void dropCourse(Long studentId, Long enrollmentId) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found"));
        
        if (!enrollment.getStudent().getId().equals(studentId)) {
            throw new RuntimeException("Enrollment does not belong to this student");
        }
        
        enrollmentRepository.delete(enrollment);
    }
    
    public List<EnrollmentDTO> getStudentGrades(Long studentId) {
        return enrollmentRepository.findByStudentIdAndGradeIsNotNull(studentId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public void assignGrade(Long enrollmentId, String grade) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found"));
        
        enrollment.setGrade(grade);
        enrollmentRepository.save(enrollment);
    }
    
    private EnrollmentDTO convertToDTO(Enrollment enrollment) {
        return new EnrollmentDTO(
                enrollment.getId(),
                enrollment.getStudent().getId(),
                enrollment.getCourse().getId(),
                enrollment.getStudent().getFirstName() + " " + enrollment.getStudent().getLastName(),
                enrollment.getCourse().getCourseTitle(),
                enrollment.getEnrollmentDate(),
                enrollment.getGrade()
        );
    }
} 