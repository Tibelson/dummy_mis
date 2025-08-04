package backend.example.backEnd.dto;

import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentRequestDTO {
    private Long studentId;
    private Long courseId;


}
