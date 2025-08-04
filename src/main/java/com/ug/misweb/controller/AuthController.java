package com.ug.misweb.controller;

import com.ug.misweb.dto.LoginRequestDTO;
import com.ug.misweb.dto.LoginResponseDTO;
import com.ug.misweb.dto.StudentDTO;
import com.ug.misweb.model.User;
import com.ug.misweb.service.AuthService;
import com.ug.misweb.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @Autowired
    private StudentService studentService;
    
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO loginRequest) {
        LoginResponseDTO response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/register")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StudentDTO> registerStudent(@Valid @RequestBody StudentDTO studentDTO) {
        StudentDTO createdStudent = authService.registerStudent(studentDTO);
        return ResponseEntity.ok(createdStudent);
    }
    
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication != null) {
            return ResponseEntity.ok(authentication.getPrincipal());
        }
        return ResponseEntity.badRequest().body("User not authenticated");
    }
} 