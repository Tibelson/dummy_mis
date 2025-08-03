package backend.example.backEnd.util;

import backend.example.backEnd.dto.StudentDTO;
import backend.example.backEnd.dto.LecturerDTO;
import backend.example.backEnd.model.Student;
import backend.example.backEnd.model.Lecturer;

public class MapperUtil {

    // ==== Student Mappings ====

    public static StudentDTO toStudentDTO(Student student) {
        StudentDTO dto = new StudentDTO();
        dto.setId(student.getId());
        dto.setName(student.getName());
        dto.setEmail(student.getEmail());
        dto.setIndexNumber(student.getIndexNumber());
        dto.setFeesPaid(student.getFeesPaid());
        dto.setLevel(student.getLevel());
        dto.setProgramme(student.getProgramme());
        return dto;
    }

    public static Student toStudent(StudentDTO dto) {
        Student student = new Student();
        student.setId(dto.getId());
        student.setName(dto.getName());
        student.setEmail(dto.getEmail());
        student.setIndexNumber(dto.getIndexNumber());
        student.setFeesPaid(dto.getFeesPaid());
        student.setLevel(dto.getLevel());
        student.setProgramme(dto.getProgramme());
        return student;
    }

    // ==== Lecturer Mappings ====

    public static LecturerDTO toLecturerDTO(Lecturer lecturer) {
        LecturerDTO dto = new LecturerDTO();
        dto.setId(lecturer.getId());
        dto.setName(lecturer.getName());
        dto.setEmail(lecturer.getEmail());
        dto.setDepartment(lecturer.getDepartment());
        dto.setStaffId(lecturer.getStaffId());
        dto.setRank(lecturer.getRank());
        return dto;
    }

    public static Lecturer toLecturer(LecturerDTO dto) {
        Lecturer lecturer = new Lecturer();
        lecturer.setId(dto.getId());
        lecturer.setName(dto.getName());
        lecturer.setEmail(dto.getEmail());
        lecturer.setDepartment(dto.getDepartment());
        lecturer.setStaffId(dto.getStaffId());
        lecturer.setRank(dto.getRank());
        return lecturer;
    }
}
