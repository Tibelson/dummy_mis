package backend.example.backEnd.model;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Lecturer {

    @Id
    private Long id;

    private String name;
    private String email;
    private String department;
    private String password;
}
