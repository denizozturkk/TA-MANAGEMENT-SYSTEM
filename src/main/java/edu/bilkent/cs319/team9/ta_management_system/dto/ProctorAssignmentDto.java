package edu.bilkent.cs319.team9.ta_management_system.dto;

import edu.bilkent.cs319.team9.ta_management_system.model.ProctorStatus;
import lombok.Data;

@Data
public class ProctorAssignmentDto {
    private Long id;
    private ProctorStatus status;

    private Long taId;
    private Long examId;
    private Long classroomId;
}
