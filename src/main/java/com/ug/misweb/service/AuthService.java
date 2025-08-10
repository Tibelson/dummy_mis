package com.ug.misweb.service;

import com.ug.misweb.dto.LoginRequestDTO;
import com.ug.misweb.dto.LoginResponseDTO;
import com.ug.misweb.dto.StudentDTO;
import com.ug.misweb.exception.ResourceNotFoundException;
import com.ug.misweb.model.Student;
import com.ug.misweb.model.User;
import com.ug.misweb.repository.StudentRepository;
import com.ug.misweb.repository.UserRepository;
import com.ug.misweb.util.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JwtTokenProvider tokenProvider;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public LoginResponseDTO login(LoginRequestDTO loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);
        
        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        return new LoginResponseDTO(jwt, user.getUsername(), user.getRole().name(), "Login successful");
    }

    public String authenticateUser(String username, String password) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        return tokenProvider.generateToken(authentication);
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
    
    public StudentDTO registerStudent(StudentDTO studentDTO) {
        // Create user account
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