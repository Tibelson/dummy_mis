package backend.example.backEnd.service;

import backend.example.backEnd.dto.StudentDTO;
import backend.example.backEnd.exception.ResourceNotFoundException;
import backend.example.backEnd.model.Student;
import backend.example.backEnd.repository.StudentRepository;
import backend.example.backEnd.util.MapperUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    public List<StudentDTO> getAllStudents() {
        return studentRepository.findAll()
                .stream()
                .map(MapperUtil::toStudentDTO)
                .collect(Collectors.toList());
    }

    public StudentDTO getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id " + id));
        return MapperUtil.toStudentDTO(student);
    }

    public StudentDTO createStudent(StudentDTO dto) {
        Student student = MapperUtil.toStudent(dto);
        return MapperUtil.toStudentDTO(studentRepository.save(student));
    }

    public StudentDTO updateStudent(Long id, StudentDTO dto) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id " + id));

        student.setName(dto.getName());
        student.setEmail(dto.getEmail());
        student.setIndexNumber(dto.getIndexNumber());
        student.setFeesPaid(dto.getFeesPaid());

        return MapperUtil.toStudentDTO(studentRepository.save(student));
    }

    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Student not found with id " + id);
        }
        studentRepository.deleteById(id);
    }

}
