package backend.example.backEnd.repository;

import backend.example.backEnd.model.Lecturer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LecturerRepository extends JpaRepository<Lecturer, Long> {
}
