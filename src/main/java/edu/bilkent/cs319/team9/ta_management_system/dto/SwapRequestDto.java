package edu.bilkent.cs319.team9.ta_management_system.dto;

import edu.bilkent.cs319.team9.ta_management_system.model.SwapStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SwapRequestDto {
    private Long id;
    private SwapStatus status;
    private LocalDateTime requestDate;

    private Long taId;
    private Long proctorAssignmentId;
    private Long targetProctorAssignmentId;
}
