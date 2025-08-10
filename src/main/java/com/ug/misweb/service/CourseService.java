package com.ug.misweb.service;

import com.ug.misweb.dto.CourseDTO;
import com.ug.misweb.exception.ResourceNotFoundException;
import com.ug.misweb.model.Course;
import com.ug.misweb.model.Lecturer;
import com.ug.misweb.repository.CourseRepository;
import com.ug.misweb.repository.LecturerRepository;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final LecturerRepository lecturerRepository;

    public CourseService(CourseRepository courseRepository, LecturerRepository lecturerRepository) {
        this.courseRepository = courseRepository;
        this.lecturerRepository = lecturerRepository;
    }

    public List<CourseDTO> getAllCourses() {
        return courseRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public CourseDTO getCourseById(Long id) {
        return courseRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id " + id));
    }

    @Transactional
    public CourseDTO createCourse(CourseDTO courseDTO) {
        Course savedCourse = courseRepository.save(convertToEntity(courseDTO));
        return convertToDTO(savedCourse);
    }

    @Transactional
    public CourseDTO updateCourse(Long id, CourseDTO courseDTO) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id " + id));

        course.setCourseCode(courseDTO.getCourseCode());
        course.setCourseTitle(courseDTO.getCourseTitle());
        course.setCredits(courseDTO.getCredits());
        course.setDescription(courseDTO.getDescription());
        course.setSemester(courseDTO.getSemester());

        return convertToDTO(courseRepository.save(course));
    }

    @Transactional
    public void deleteCourse(Long id) {
        try {
            courseRepository.deleteById(id);
        } catch (EmptyResultDataAccessException e) {
            throw new ResourceNotFoundException("Course not found with id " + id);
        }
    }
    
    public long getTotalCourses() {
        return courseRepository.count();
    }
    
    @Transactional
    public CourseDTO assignLecturerToCourse(Long courseId, Long lecturerId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id " + courseId));
        
        Lecturer lecturer = lecturerRepository.findById(lecturerId)
                .orElseThrow(() -> new ResourceNotFoundException("Lecturer not found with id " + lecturerId));
        
        course.setLecturer(lecturer);
        Course savedCourse = courseRepository.save(course);
        return convertToDTO(savedCourse);
    }
    
    public List<CourseDTO> getCoursesByLecturer(Long lecturerId) {
        return courseRepository.findByLecturerId(lecturerId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private CourseDTO convertToDTO(Course course) {
        CourseDTO dto = new CourseDTO();
        dto.setId(course.getId());
        dto.setCourseCode(course.getCourseCode());
        dto.setCourseTitle(course.getCourseTitle());
        dto.setCredits(course.getCredits());
        dto.setDescription(course.getDescription());
        dto.setSemester(course.getSemester());
        
        if (course.getLecturer() != null) {
            dto.setLecturerId(course.getLecturer().getId());
            dto.setLecturerName(course.getLecturer().getFirstName() + " " + course.getLecturer().getLastName());
        }
        
        return dto;
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
