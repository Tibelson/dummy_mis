package backend.example.backEnd.util;

import backend.example.backEnd.dto.StudentDTO;
import backend.example.backEnd.model.Student;

public class MapperUtil {
    public static StudentDTO toStudentDTO(Student student){
        StudentDTO dto = new StudentDTO();
        dto.setName(student.getName());
        dto.setEmail(student.getEmail());
        dto.setIndexNumber(student.getIndexNumber());
        dto.setFeesPaid(student.getFeesPaid());
        return dto;
    }

    public static Student toStudent(StudentDTO dto){
        Student student = new Student();
        student.setName(dto.getName());
        student.setEmail(dto.getEmail());
        student.setIndexNumber(dto.getIndexNumber());
        student.setFeesPaid(dto.getFeesPaid());
        return student;
    }
}
