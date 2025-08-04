package com.ug.misweb.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseDTO {
    private Long id;
    
    @NotBlank(message = "Course code is required")
    private String courseCode;
    
    @NotBlank(message = "Course title is required")
    private String courseTitle;
    
    @NotNull(message = "Credits are required")
    @Positive(message = "Credits must be positive")
    private Integer credits;
    
    private String description;
    
    @NotBlank(message = "Semester is required")
    private String semester;
} 