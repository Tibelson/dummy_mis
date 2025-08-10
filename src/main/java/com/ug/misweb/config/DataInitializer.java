package com.ug.misweb.config;

import com.ug.misweb.model.Course;
import com.ug.misweb.model.User;
import com.ug.misweb.repository.CourseRepository;
import com.ug.misweb.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CourseRepository courseRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        // Create admin user if not exists
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(User.Role.ADMIN);
            admin.setEnabled(true);
            userRepository.save(admin);
        }

        // Create test student user if not exists
        if (!userRepository.existsByUsername("STU001")) {
            User student = new User();
            student.setUsername("STU001");
            student.setPassword(passwordEncoder.encode("STU001"));
            student.setRole(User.Role.STUDENT);
            student.setEnabled(true);
            userRepository.save(student);
        }

        // Create test lecturer user if not exists
        if (!userRepository.existsByUsername("john.doe@test.com")) {
            User lecturer = new User();
            lecturer.setUsername("john.doe@test.com");
            lecturer.setPassword(passwordEncoder.encode("EMP001"));
            lecturer.setRole(User.Role.LECTURER);
            lecturer.setEnabled(true);
            userRepository.save(lecturer);
        }
        
        if (courseRepository.count() == 0) {
            Course course1 = new Course();
            course1.setCourseCode("CS101");
            course1.setCourseTitle("Introduction to Computer Science");
            course1.setCredits(3);
            course1.setDescription("Basic concepts of computer science and programming");
            course1.setSemester("Fall 2024");
            courseRepository.save(course1);
            
            Course course2 = new Course();
            course2.setCourseCode("MATH201");
            course2.setCourseTitle("Calculus I");
            course2.setCredits(4);
            course2.setDescription("Introduction to differential calculus");
            course2.setSemester("Fall 2024");
            courseRepository.save(course2);
            
            Course course3 = new Course();
            course3.setCourseCode("ENG101");
            course3.setCourseTitle("English Composition");
            course3.setCredits(3);
            course3.setDescription("Basic writing and communication skills");
            course3.setSemester("Fall 2024");
            courseRepository.save(course3);
        }
    }
} 