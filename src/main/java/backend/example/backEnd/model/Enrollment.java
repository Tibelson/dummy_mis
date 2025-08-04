package backend.example.backEnd.model;
import jakarta.persistence.*;
import lombok.*;
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Enrollment {

        @Id
        private Long id;

        @ManyToOne
        private Student student;

        @ManyToOne
        private Course course;

        private String grade;
}
