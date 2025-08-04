package com.ug.misweb.service;

import com.ug.misweb.dto.StudentDTO;
import com.ug.misweb.exception.ResourceNotFoundException;
import com.ug.misweb.model.Student;
import com.ug.misweb.model.User;
import com.ug.misweb.repository.StudentRepository;
import com.ug.misweb.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentService {
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public List<StudentDTO> getAllStudents() {
        return studentRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public StudentDTO getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id " + id));
        return convertToDTO(student);
    }
    
    public StudentDTO createStudent(StudentDTO studentDTO) {
        // Create user account first
        User user = new User();
        user.setUsername(studentDTO.getAdmissionNumber());
        user.setPassword(passwordEncoder.encode(studentDTO.getAdmissionNumber())); // Default password
        user.setRole(User.Role.STUDENT);
        user.setEnabled(true);
        
        User savedUser = userRepository.save(user);
        
        // Create student profile
        Student student = new Student();
        student.setUser(savedUser);
        student.setFirstName(studentDTO.getFirstName());
        student.setLastName(studentDTO.getLastName());
        student.setEmail(studentDTO.getEmail());
        student.setAdmissionNumber(studentDTO.getAdmissionNumber());
        student.setDateOfBirth(studentDTO.getDateOfBirth());
        student.setDepartment(studentDTO.getDepartment());
        
        Student savedStudent = studentRepository.save(student);
        return convertToDTO(savedStudent);
    }
    
    public StudentDTO updateStudent(Long id, StudentDTO studentDTO) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id " + id));
        
        student.setFirstName(studentDTO.getFirstName());
        student.setLastName(studentDTO.getLastName());
        student.setEmail(studentDTO.getEmail());
        student.setAdmissionNumber(studentDTO.getAdmissionNumber());
        student.setDateOfBirth(studentDTO.getDateOfBirth());
        student.setDepartment(studentDTO.getDepartment());
        
        Student updatedStudent = studentRepository.save(student);
        return convertToDTO(updatedStudent);
    }
    
    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Student not found with id " + id);
        }
        studentRepository.deleteById(id);
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