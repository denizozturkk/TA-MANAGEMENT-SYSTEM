package edu.bilkent.cs319.team9.ta_management_system.dto;

import edu.bilkent.cs319.team9.ta_management_system.model.LeaveStatus;
import lombok.Data;

@Data
public class LeaveRequestDto {
    private Long id;
    private String reason;
    private LeaveStatus status;
    private Long taId;
    private Long proctorAssignmentId;
}
