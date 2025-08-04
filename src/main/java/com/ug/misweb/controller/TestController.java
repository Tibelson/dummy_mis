package com.ug.misweb.controller;

import com.ug.misweb.model.User;
import com.ug.misweb.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
public class TestController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @PostMapping("/user")
    public ResponseEntity<String> createTestUser() {
        try {
            User user = new User();
            user.setUsername("testuser");
            user.setPassword(passwordEncoder.encode("password"));
            user.setRole(User.Role.STUDENT);
            user.setEnabled(true);
            
            User savedUser = userRepository.save(user);
            return ResponseEntity.ok("User created with ID: " + savedUser.getId());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/users")
    public ResponseEntity<String> getUsers() {
        try {
            long count = userRepository.count();
            return ResponseEntity.ok("Total users: " + count);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
} 