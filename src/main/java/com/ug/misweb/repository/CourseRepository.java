package com.ug.misweb.repository;

import com.ug.misweb.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findBySemester(String semester);
    Optional<Course> findByCourseCode(String courseCode);
    List<Course> findByLecturerId(Long lecturerId);
} 