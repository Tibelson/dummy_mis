package backend.example.backEnd.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String  name;
    private String email;
    private String level;
    private String programme;
    private String indexNumber;
    private Double feesPaid;


}


