package com.ug.misweb.service;

import com.ug.misweb.model.Lecturer;
import com.ug.misweb.model.User;
import com.ug.misweb.dto.LecturerDTO;
import com.ug.misweb.repository.LecturerRepository;
import com.ug.misweb.repository.UserRepository;
import com.ug.misweb.exception.ResourceNotFoundException;
import com.ug.misweb.exception.DuplicateResourceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class LecturerService {
    
    @Autowired
    private LecturerRepository lecturerRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public List<Lecturer> getAllLecturers() {
        return lecturerRepository.findAll();
    }
    
    public List<LecturerDTO> getAllLecturerDTOs() {
        return lecturerRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<Lecturer> getActiveLecturers() {
        return lecturerRepository.findAllActiveLecturers();
    }
    
    public List<Lecturer> getLecturersByDepartment(String department) {
        return lecturerRepository.findActiveLecturersByDepartment(department);
    }
    
    public Lecturer getLecturerById(Long id) {
        return lecturerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lecturer not found with id: " + id));
    }
    
    public LecturerDTO getLecturerDTOById(Long id) {
        Lecturer lecturer = getLecturerById(id);
        return convertToDTO(lecturer);
    }
    
    public Lecturer getLecturerByEmail(String email) {
        return lecturerRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Lecturer not found with email: " + email));
    }
    
    public Lecturer getLecturerByEmployeeNumber(String employeeNumber) {
        return lecturerRepository.findByEmployeeNumber(employeeNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Lecturer not found with employee number: " + employeeNumber));
    }
    
    public Lecturer createLecturer(Lecturer lecturer) {
        // Validate unique constraints
        if (lecturerRepository.existsByEmail(lecturer.getEmail())) {
            throw new DuplicateResourceException("Email already exists: " + lecturer.getEmail());
        }
        
        if (lecturerRepository.existsByEmployeeNumber(lecturer.getEmployeeNumber())) {
            throw new DuplicateResourceException("Employee number already exists: " + lecturer.getEmployeeNumber());
        }
        
        // Create user account
        User user = new User();
        user.setUsername(lecturer.getEmail());
        user.setPassword(passwordEncoder.encode(lecturer.getEmployeeNumber())); // Default password
        user.setRole(User.Role.LECTURER);
        user.setEnabled(true);
        
        User savedUser = userRepository.save(user);
        lecturer.setUser(savedUser);
        
        // Set hire date if not provided
        if (lecturer.getHireDate() == null) {
            lecturer.setHireDate(LocalDate.now());
        }
        
        return lecturerRepository.save(lecturer);
    }
    
    public LecturerDTO createLecturer(LecturerDTO lecturerDTO) {
        Lecturer lecturer = convertToEntity(lecturerDTO);
        Lecturer savedLecturer = createLecturer(lecturer);
        return convertToDTO(savedLecturer);
    }
    
    public Lecturer updateLecturer(Long id, Lecturer lecturerDetails) {
        Lecturer lecturer = getLecturerById(id);
        
        // Check if email is being changed and if it's unique
        if (!lecturer.getEmail().equals(lecturerDetails.getEmail()) && 
            lecturerRepository.existsByEmail(lecturerDetails.getEmail())) {
            throw new DuplicateResourceException("Email already exists: " + lecturerDetails.getEmail());
        }
        
        // Check if employee number is being changed and if it's unique
        if (!lecturer.getEmployeeNumber().equals(lecturerDetails.getEmployeeNumber()) && 
            lecturerRepository.existsByEmployeeNumber(lecturerDetails.getEmployeeNumber())) {
            throw new DuplicateResourceException("Employee number already exists: " + lecturerDetails.getEmployeeNumber());
        }
        
        // Update lecturer fields
        lecturer.setFirstName(lecturerDetails.getFirstName());
        lecturer.setLastName(lecturerDetails.getLastName());
        lecturer.setEmail(lecturerDetails.getEmail());
        lecturer.setEmployeeNumber(lecturerDetails.getEmployeeNumber());
        lecturer.setDepartment(lecturerDetails.getDepartment());
        lecturer.setSpecialization(lecturerDetails.getSpecialization());
        lecturer.setPhoneNumber(lecturerDetails.getPhoneNumber());
        
        // Update user username if email changed
        if (!lecturer.getUser().getUsername().equals(lecturerDetails.getEmail())) {
            lecturer.getUser().setUsername(lecturerDetails.getEmail());
        }
        
        return lecturerRepository.save(lecturer);
    }
    
    public LecturerDTO updateLecturer(Long id, LecturerDTO lecturerDTO) {
        Lecturer lecturerDetails = convertToEntity(lecturerDTO);
        Lecturer updatedLecturer = updateLecturer(id, lecturerDetails);
        return convertToDTO(updatedLecturer);
    }
    
    public void deleteLecturer(Long id) {
        Lecturer lecturer = getLecturerById(id);
        
        // Disable the user account instead of deleting
        lecturer.getUser().setEnabled(false);
        userRepository.save(lecturer.getUser());
        
        // Note: We're not deleting the lecturer record to maintain data integrity
        // The lecturer will be filtered out by the "active" queries
    }
    
    public void changePassword(Long lecturerId, String newPassword) {
        Lecturer lecturer = getLecturerById(lecturerId);
        lecturer.getUser().setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(lecturer.getUser());
    }
    
        public long getTotalLecturers() {
        return lecturerRepository.count();
    }

    public LecturerDTO getLecturerByUserId(Long userId) {
        return lecturerRepository.findByUserId(userId)
                .map(this::convertToDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Lecturer not found with user id " + userId));
    }

    // DTO conversion methods
    public LecturerDTO convertToDTO(Lecturer lecturer) {
        LecturerDTO dto = new LecturerDTO();
        dto.setId(lecturer.getId());
        dto.setFirstName(lecturer.getFirstName());
        dto.setLastName(lecturer.getLastName());
        dto.setEmail(lecturer.getEmail());
        dto.setEmployeeNumber(lecturer.getEmployeeNumber());
        dto.setDepartment(lecturer.getDepartment());
        dto.setSpecialization(lecturer.getSpecialization());
        dto.setHireDate(lecturer.getHireDate());
        dto.setPhoneNumber(lecturer.getPhoneNumber());
        
        if (lecturer.getUser() != null) {
            dto.setUserId(lecturer.getUser().getId());
            dto.setUsername(lecturer.getUser().getUsername());
            dto.setEnabled(lecturer.getUser().isEnabled());
        }
        
        return dto;
    }
    
    public Lecturer convertToEntity(LecturerDTO dto) {
        Lecturer lecturer = new Lecturer();
        lecturer.setId(dto.getId());
        lecturer.setFirstName(dto.getFirstName());
        lecturer.setLastName(dto.getLastName());
        lecturer.setEmail(dto.getEmail());
        lecturer.setEmployeeNumber(dto.getEmployeeNumber());
        lecturer.setDepartment(dto.getDepartment());
        lecturer.setSpecialization(dto.getSpecialization());
        lecturer.setHireDate(dto.getHireDate());
        lecturer.setPhoneNumber(dto.getPhoneNumber());
        return lecturer;
    }
} 