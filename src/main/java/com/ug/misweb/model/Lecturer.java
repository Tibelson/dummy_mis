package com.ug.misweb.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "lecturers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Lecturer {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false)
    private String firstName;
    
    @Column(nullable = false)
    private String lastName;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(unique = true, nullable = false)
    private String employeeNumber;
    
    @Column(nullable = false)
    private String department;
    
    @Column(nullable = false)
    private String specialization;
    
    @Column(nullable = false)
    private LocalDate hireDate;
    
    @Column
    private String phoneNumber;
    
    @OneToMany(mappedBy = "lecturer")
    @JsonManagedReference
    private List<Course> courses;
} 