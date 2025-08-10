package com.ug.misweb.controller;

import com.ug.misweb.dto.LoginRequest;
import com.ug.misweb.dto.LoginResponse;
import com.ug.misweb.dto.StudentDTO;
import com.ug.misweb.dto.LecturerDTO;
import com.ug.misweb.model.User;
import com.ug.misweb.service.AuthService;
import com.ug.misweb.service.StudentService;
import com.ug.misweb.service.LecturerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private StudentService studentService;

    @Autowired
    private LecturerService lecturerService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            // Use the existing AuthService for authentication
            String token = authService.authenticateUser(loginRequest.getUsername(), loginRequest.getPassword());
            User user = authService.getUserByUsername(loginRequest.getUsername());

            // Get role-specific details
            Map<String, Object> userDetails = new HashMap<>();
            userDetails.put("id", user.getId());
            userDetails.put("username", user.getUsername());
            userDetails.put("role", user.getRole().name());

            // Add role-specific information
            switch (user.getRole()) {
                case STUDENT:
                    try {
                        StudentDTO student = studentService.getStudentByUserId(user.getId());
                        userDetails.put("studentId", student.getId());
                        userDetails.put("firstName", student.getFirstName());
                        userDetails.put("lastName", student.getLastName());
                        userDetails.put("email", student.getEmail());
                        userDetails.put("admissionNumber", student.getAdmissionNumber());
                    } catch (Exception e) {
                        userDetails.put("message", "Student profile not found");
                    }
                    break;
                case LECTURER:
                    try {
                        LecturerDTO lecturer = lecturerService.getLecturerByUserId(user.getId());
                        userDetails.put("lecturerId", lecturer.getId());
                        userDetails.put("firstName", lecturer.getFirstName());
                        userDetails.put("lastName", lecturer.getLastName());
                        userDetails.put("email", lecturer.getEmail());
                        userDetails.put("employeeNumber", lecturer.getEmployeeNumber());
                    } catch (Exception e) {
                        userDetails.put("message", "Lecturer profile not found");
                    }
                    break;
                case ADMIN:
                    userDetails.put("message", "Admin access granted");
                    break;
            }

            LoginResponse response = new LoginResponse();
            response.setToken(token);
            response.setUserDetails(userDetails);
            response.setMessage("Login successful");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                new LoginResponse(null, null, "Invalid username or password")
            );
        }
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            User user = (User) authentication.getPrincipal();
            
            Map<String, Object> userDetails = new HashMap<>();
            userDetails.put("id", user.getId());
            userDetails.put("username", user.getUsername());
            userDetails.put("role", user.getRole().name());

            // Add role-specific information
            switch (user.getRole()) {
                case STUDENT:
                    try {
                        StudentDTO student = studentService.getStudentByUserId(user.getId());
                        userDetails.put("studentId", student.getId());
                        userDetails.put("firstName", student.getFirstName());
                        userDetails.put("lastName", student.getLastName());
                        userDetails.put("email", student.getEmail());
                        userDetails.put("admissionNumber", student.getAdmissionNumber());
                    } catch (Exception e) {
                        userDetails.put("message", "Student profile not found");
                    }
                    break;
                case LECTURER:
                    try {
                        LecturerDTO lecturer = lecturerService.getLecturerByUserId(user.getId());
                        userDetails.put("lecturerId", lecturer.getId());
                        userDetails.put("firstName", lecturer.getFirstName());
                        userDetails.put("lastName", lecturer.getLastName());
                        userDetails.put("email", lecturer.getEmail());
                        userDetails.put("employeeNumber", lecturer.getEmployeeNumber());
                    } catch (Exception e) {
                        userDetails.put("message", "Lecturer profile not found");
                    }
                    break;
                case ADMIN:
                    userDetails.put("message", "Admin access granted");
                    break;
            }

            return ResponseEntity.ok(userDetails);
        }
        return ResponseEntity.badRequest().body(Map.of("error", "User not authenticated"));
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout() {
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }
} 