package com.ug.misweb.config;

import com.ug.misweb.model.Course;
import com.ug.misweb.model.Lecturer;
import com.ug.misweb.model.User;
import com.ug.misweb.repository.CourseRepository;
import com.ug.misweb.repository.UserRepository;
import com.ug.misweb.repository.LecturerRepository;
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
    private LecturerRepository lecturerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        // Upsert admin user with known dev password
        User admin = userRepository.findByUsername("admin").orElseGet(User::new);
        admin.setUsername("admin");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole(User.Role.ADMIN);
        admin.setEnabled(true);
        userRepository.save(admin);

        // Upsert test student user with known dev password
        User student = userRepository.findByUsername("STU001").orElseGet(User::new);
        student.setUsername("STU001");
        student.setPassword(passwordEncoder.encode("STU001"));
        student.setRole(User.Role.STUDENT);
        student.setEnabled(true);
        userRepository.save(student);

        // Upsert test lecturer user and ensure profile exists
        User lecturerUser = userRepository.findByUsername("john.doe@test.com").orElseGet(User::new);
        boolean isNewLecturerUser = lecturerUser.getId() == null;
        lecturerUser.setUsername("john.doe@test.com");
        lecturerUser.setPassword(passwordEncoder.encode("EMP001"));
        lecturerUser.setRole(User.Role.LECTURER);
        lecturerUser.setEnabled(true);
        lecturerUser = userRepository.save(lecturerUser);

        // Ensure Lecturer profile exists
        if (isNewLecturerUser || lecturerRepository.findByUserId(lecturerUser.getId()).isEmpty()) {
            Lecturer lec = new Lecturer();
            lec.setUser(lecturerUser);
            lec.setFirstName("John");
            lec.setLastName("Doe");
            lec.setEmail("john.doe@test.com");
            lec.setEmployeeNumber("EMP001");
            lec.setDepartment("Computer Engineering");
            lec.setSpecialization("Software Engineering");
            lec.setHireDate(java.time.LocalDate.now());
            lecturerRepository.save(lec);
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