package edu.bilkent.cs319.team9.ta_management_system.dto;

import edu.bilkent.cs319.team9.ta_management_system.model.ExcuseType;
import edu.bilkent.cs319.team9.ta_management_system.model.ExtensionRequestStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class DutyExtensionRequestDto {
    private Long id;
    private String reason;
    private int requestedExtensionDays;
    private LocalDateTime requestedAt;
    private ExtensionRequestStatus status;
    private ExcuseType excuseType;

    private Long taId;
    private Long instructorId;
    private Long dutyLogId;
}
