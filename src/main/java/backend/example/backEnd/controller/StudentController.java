package backend.example.backEnd.controller;

import backend.example.backEnd.dto.StudentDTO;
import backend.example.backEnd.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/students")
public class StudentController {
    @Autowired
    private StudentService studentService;

    @GetMapping
    public List<StudentDTO>getAllStudents(){
        return studentService.getAllStudents();
    }
    @GetMapping("/{id}")
    public StudentDTO getStudentById(@PathVariable Long id){
        return studentService.getStudentById(id);
    }
    @PostMapping
    public StudentDTO createStudent(@RequestBody StudentDTO dto){
        return studentService.createStudent(dto);
    }

    @PutMapping("/{id}")
    public StudentDTO updateStudent(@PathVariable Long id, @RequestBody StudentDTO dto){
        return studentService.updateStudent(id,dto);
    }
    @DeleteMapping("/{id}")
    public void deleteStudent(@PathVariable Long id){
        studentService.deleteStudent(id);
    }
}
