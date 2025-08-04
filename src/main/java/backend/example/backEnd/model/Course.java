package backend.example.backEnd.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Course {
    @Id
    private Long  id;

    private String name;

    @ManyToOne
    private Lecturer lecturer;

    @OneToMany(mappedBy = "course")
    private List<Enrollment> enrollments;
}
