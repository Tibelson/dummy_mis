package com.ug.misweb.service;

import com.ug.misweb.dto.CourseDTO;
import com.ug.misweb.exception.ResourceNotFoundException;
import com.ug.misweb.model.Course;
import com.ug.misweb.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseService {
    
    @Autowired
    private CourseRepository courseRepository;
    
    public List<CourseDTO> getAllCourses() {
        return courseRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public CourseDTO getCourseById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id " + id));
        return convertToDTO(course);
    }
    
    public CourseDTO createCourse(CourseDTO courseDTO) {
        Course course = convertToEntity(courseDTO);
        Course savedCourse = courseRepository.save(course);
        return convertToDTO(savedCourse);
    }
    
    public CourseDTO updateCourse(Long id, CourseDTO courseDTO) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id " + id));
        
        course.setCourseCode(courseDTO.getCourseCode());
        course.setCourseTitle(courseDTO.getCourseTitle());
        course.setCredits(courseDTO.getCredits());
        course.setDescription(courseDTO.getDescription());
        course.setSemester(courseDTO.getSemester());
        
        Course updatedCourse = courseRepository.save(course);
        return convertToDTO(updatedCourse);
    }
    
    public void deleteCourse(Long id) {
        if (!courseRepository.existsById(id)) {
            throw new ResourceNotFoundException("Course not found with id " + id);
        }
        courseRepository.deleteById(id);
    }
    
    private CourseDTO convertToDTO(Course course) {
        return new CourseDTO(
                course.getId(),
                course.getCourseCode(),
                course.getCourseTitle(),
                course.getCredits(),
                course.getDescription(),
                course.getSemester()
        );
    }
    
    private Course convertToEntity(CourseDTO dto) {
        Course course = new Course();
        course.setCourseCode(dto.getCourseCode());
        course.setCourseTitle(dto.getCourseTitle());
        course.setCredits(dto.getCredits());
        course.setDescription(dto.getDescription());
        course.setSemester(dto.getSemester());
        return course;
    }
} 