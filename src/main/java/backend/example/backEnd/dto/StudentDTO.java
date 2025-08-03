package backend.example.backEnd.dto;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentDTO {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)


    private String  name;
    private String email;
    private String level;
    private String programme;
    private String indexNumber;
    private Double feesPaid;

}
