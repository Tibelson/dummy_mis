package backend.example.backEnd.controller;

import backend.example.backEnd.dto.LecturerDTO;
import backend.example.backEnd.service.LecturerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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

    @PostMapping("/register")
    public LecturerDTO createLecturer(@RequestBody LecturerDTO dto) {
        return lecturerService.createLecturer(dto);
    }

    @PostMapping("/login")
    public ResponseEntity<LecturerDTO> login(@RequestBody Map<String, String> credentials) {
        Long id = Long.parseLong(credentials.get("id"));
        String password = credentials.get("password");

        LecturerDTO dto = lecturerService.login(id, password);
        return ResponseEntity.ok(dto);
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
