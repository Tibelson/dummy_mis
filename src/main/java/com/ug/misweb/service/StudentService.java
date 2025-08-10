package com.ug.misweb.service;

import com.ug.misweb.dto.StudentDTO;
import com.ug.misweb.exception.ResourceNotFoundException;
import com.ug.misweb.model.Student;
import com.ug.misweb.model.User;
import com.ug.misweb.repository.StudentRepository;
import com.ug.misweb.repository.UserRepository;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public StudentService(StudentRepository studentRepository,
                          UserRepository userRepository,
                          PasswordEncoder passwordEncoder) {
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<StudentDTO> getAllStudents() {
        return studentRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public StudentDTO getStudentById(Long id) {
        return studentRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id " + id));
    }

    @Transactional
    public StudentDTO createStudent(StudentDTO studentDTO) {
        User user = new User();
        user.setUsername(studentDTO.getAdmissionNumber());
        user.setPassword(passwordEncoder.encode(studentDTO.getAdmissionNumber())); // default password
        user.setRole(User.Role.STUDENT);
        user.setEnabled(true);

        User savedUser = userRepository.save(user);

        Student student = new Student();
        student.setUser(savedUser);
        student.setFirstName(studentDTO.getFirstName());
        student.setLastName(studentDTO.getLastName());
        student.setEmail(studentDTO.getEmail());
        student.setAdmissionNumber(studentDTO.getAdmissionNumber());
        student.setDateOfBirth(studentDTO.getDateOfBirth());
        student.setDepartment(studentDTO.getDepartment());

        return convertToDTO(studentRepository.save(student));
    }

    @Transactional
    public StudentDTO updateStudent(Long id, StudentDTO studentDTO) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id " + id));

        student.setFirstName(studentDTO.getFirstName());
        student.setLastName(studentDTO.getLastName());
        student.setEmail(studentDTO.getEmail());
        student.setAdmissionNumber(studentDTO.getAdmissionNumber());
        student.setDateOfBirth(studentDTO.getDateOfBirth());
        student.setDepartment(studentDTO.getDepartment());

        return convertToDTO(studentRepository.save(student));
    }

    @Transactional
    public void deleteStudent(Long id) {
        try {
            studentRepository.deleteById(id);
        } catch (EmptyResultDataAccessException e) {
            throw new ResourceNotFoundException("Student not found with id " + id);
        }
    }
    
    public long getTotalStudents() {
        return studentRepository.count();
    }

    public StudentDTO getStudentByUserId(Long userId) {
        return studentRepository.findByUserId(userId)
                .map(this::convertToDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with user id " + userId));
    }

    private StudentDTO convertToDTO(Student student) {
        return new StudentDTO(
                student.getId(),
                student.getFirstName(),
                student.getLastName(),
                student.getEmail(),
                student.getAdmissionNumber(),
                student.getDateOfBirth(),
                student.getDepartment()
        );
    }
}
