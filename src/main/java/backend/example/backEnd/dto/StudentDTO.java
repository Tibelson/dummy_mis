package backend.example.backEnd.dto;

import lombok.Data;

@Data
public class StudentDTO {

    private String name;
    private String email;
    private String indexNumber;
    private Double feesPaid;

}
