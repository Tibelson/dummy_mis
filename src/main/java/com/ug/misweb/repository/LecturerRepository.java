package com.ug.misweb.repository;

import com.ug.misweb.model.Lecturer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LecturerRepository extends JpaRepository<Lecturer, Long> {
    
    Optional<Lecturer> findByEmail(String email);
    
    Optional<Lecturer> findByEmployeeNumber(String employeeNumber);
    
    Optional<Lecturer> findByUserId(Long userId);
    
    List<Lecturer> findByDepartment(String department);
    
    @Query("SELECT l FROM Lecturer l WHERE l.user.enabled = true")
    List<Lecturer> findAllActiveLecturers();
    
    @Query("SELECT l FROM Lecturer l WHERE l.department = :department AND l.user.enabled = true")
    List<Lecturer> findActiveLecturersByDepartment(@Param("department") String department);
    
    boolean existsByEmail(String email);
    
    boolean existsByEmployeeNumber(String employeeNumber);
} 