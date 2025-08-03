package backend.example.backEnd.dto;

import lombok.Data;

@Data
public class LecturerDTO {
    private Long id;
    private String name;
    private String email;
    private String department;
    private String staffId;
    private String rank;
}
