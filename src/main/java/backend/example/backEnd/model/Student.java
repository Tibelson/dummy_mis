package backend.example.backEnd.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Student {
    @Id
    private Long id;

    private String  name;
    private String email;
    private String level;
    private String programme;
    private String indexNumber;
    private Double feesPaid;
    @OneToMany(mappedBy = "student")
    private List<Enrollment> enrollments;



}


