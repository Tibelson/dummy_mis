package com.ug.misweb.controller;

import com.ug.misweb.dto.CourseDTO;
import com.ug.misweb.service.CourseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "*")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping
    public ResponseEntity<List<CourseDTO>> getAllCourses() {
        List<CourseDTO> courses = courseService.getAllCourses();
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseDTO> getCourseById(@PathVariable Long id) {
        CourseDTO course = courseService.getCourseById(id);
        if (course == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(course);
    }
    
    @GetMapping("/lecturer/{lecturerId}")
    public ResponseEntity<List<CourseDTO>> getCoursesByLecturer(@PathVariable Long lecturerId) {
        List<CourseDTO> courses = courseService.getCoursesByLecturer(lecturerId);
        return ResponseEntity.ok(courses);
    }
    
    @PutMapping("/{courseId}/assign-lecturer/{lecturerId}")
    public ResponseEntity<CourseDTO> assignLecturerToCourse(@PathVariable Long courseId, @PathVariable Long lecturerId) {
        CourseDTO course = courseService.assignLecturerToCourse(courseId, lecturerId);
        return ResponseEntity.ok(course);
    }
}
