package com.ug.misweb.repository;

import com.ug.misweb.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByUserUsername(String username);
    Optional<Student> findByAdmissionNumber(String admissionNumber);
    Optional<Student> findByEmail(String email);
    Optional<Student> findByUserId(Long userId);
} 