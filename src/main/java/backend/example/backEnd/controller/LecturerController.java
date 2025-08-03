package backend.example.backEnd.controller;

import backend.example.backEnd.dto.LecturerDTO;
import backend.example.backEnd.service.LecturerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/lecturers")
public class LecturerController {

    @Autowired
    private LecturerService lecturerService;

    @GetMapping
    public List<LecturerDTO> getAllLecturers() {
        return lecturerService.getAllLecturers();
    }

    @GetMapping("/{id}")
    public LecturerDTO getLecturerById(@PathVariable Long id) {
        return lecturerService.getLecturerById(id);
    }

    @PostMapping
    public LecturerDTO createLecturer(@RequestBody LecturerDTO dto) {
        return lecturerService.createLecturer(dto);
    }

    @PutMapping("/{id}")
    public LecturerDTO updateLecturer(@PathVariable Long id, @RequestBody LecturerDTO dto) {
        return lecturerService.updateLecturer(id, dto);
    }

    @DeleteMapping("/{id}")
    public void deleteLecturer(@PathVariable Long id) {
        lecturerService.deleteLecturer(id);
    }
}
