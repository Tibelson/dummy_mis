package com.ug.misweb.service;

import com.ug.misweb.dto.EnrollmentDTO;
import com.ug.misweb.exception.ResourceNotFoundException;
import com.ug.misweb.model.Course;
import com.ug.misweb.model.Enrollment;
import com.ug.misweb.model.Student;
import com.ug.misweb.repository.CourseRepository;
import com.ug.misweb.repository.EnrollmentRepository;
import com.ug.misweb.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;

    public EnrollmentService(EnrollmentRepository enrollmentRepository,
                             StudentRepository studentRepository,
                             CourseRepository courseRepository) {
        this.enrollmentRepository = enrollmentRepository;
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
    }

    @Transactional
    public EnrollmentDTO enrollStudent(Long studentId, Long courseId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        if (enrollmentRepository.findByStudentIdAndCourseId(studentId, courseId).isPresent()) {
            throw new IllegalStateException("Student is already enrolled in this course");
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(student);
        enrollment.setCourse(course);
        enrollment.setEnrollmentDate(LocalDateTime.now());

        return convertToDTO(enrollmentRepository.save(enrollment));
    }

    public List<EnrollmentDTO> getStudentEnrollments(Long studentId) {
        return enrollmentRepository.findByStudentId(studentId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public boolean dropCourse(Long studentId, Long enrollmentId) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found"));

        if (!enrollment.getStudent().getId().equals(studentId)) {
            throw new IllegalStateException("Enrollment does not belong to this student");
        }

        enrollmentRepository.delete(enrollment);
        return true; // fixed bug
    }

    public List<EnrollmentDTO> getStudentGrades(Long studentId) {
        return enrollmentRepository.findByStudentIdAndGradeIsNotNull(studentId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void assignGrade(Long enrollmentId, String grade) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found"));

        enrollment.setGrade(grade);
        enrollmentRepository.save(enrollment);
    }
    
    public void removeEnrollment(Long enrollmentId) {
        enrollmentRepository.deleteById(enrollmentId);
    }
    
    public long getTotalEnrollments() {
        return enrollmentRepository.count();
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
