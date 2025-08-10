package com.ug.misweb.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LecturerDTO {
    
    private Long id;
    
    @NotBlank(message = "First name is required")
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    private String lastName;
    
    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;
    
    @NotBlank(message = "Employee number is required")
    private String employeeNumber;
    
    @NotBlank(message = "Department is required")
    private String department;
    
    @NotBlank(message = "Specialization is required")
    private String specialization;
    
    @NotNull(message = "Hire date is required")
    private LocalDate hireDate;
    
    private String phoneNumber;
    
    private Long userId;
    private String username;
    private boolean enabled;
} 