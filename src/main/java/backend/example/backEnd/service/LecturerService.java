package backend.example.backEnd.service;

import backend.example.backEnd.dto.LecturerDTO;
import backend.example.backEnd.exception.ResourceNotFoundException;
import backend.example.backEnd.model.Lecturer;
import backend.example.backEnd.repository.LecturerRepository;
import backend.example.backEnd.util.MapperUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LecturerService {

    @Autowired
    private LecturerRepository lecturerRepository;

    public List<LecturerDTO> getAllLecturers() {
        return lecturerRepository.findAll()
                .stream()
                .map(MapperUtil::toLecturerDTO)
                .collect(Collectors.toList());
    }

    public LecturerDTO getLecturerById(Long id) {
        Lecturer lecturer = lecturerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lecturer not found with id " + id));
        return MapperUtil.toLecturerDTO(lecturer);
    }

    public LecturerDTO createLecturer(LecturerDTO dto) {
        Lecturer lecturer = MapperUtil.toLecturer(dto);
        return MapperUtil.toLecturerDTO(lecturerRepository.save(lecturer));
    }

    public LecturerDTO updateLecturer(Long id, LecturerDTO dto) {
        Lecturer lecturer = lecturerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lecturer not found with id " + id));

        lecturer.setName(dto.getName());
        lecturer.setEmail(dto.getEmail());
        lecturer.setDepartment(dto.getDepartment());
        lecturer.setStaffId(dto.getStaffId());
        lecturer.setRank(dto.getRank());

        return MapperUtil.toLecturerDTO(lecturerRepository.save(lecturer));
    }

    public void deleteLecturer(Long id) {
        if (!lecturerRepository.existsById(id)) {
            throw new ResourceNotFoundException("Lecturer not found with id " + id);
        }
        lecturerRepository.deleteById(id);
    }

}
