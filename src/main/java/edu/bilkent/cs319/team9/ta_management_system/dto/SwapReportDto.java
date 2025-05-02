// src/main/java/edu/bilkent/cs319/team9/ta_management_system/dto/SwapReportDto.java
package edu.bilkent.cs319.team9.ta_management_system.dto;

import edu.bilkent.cs319.team9.ta_management_system.model.SwapRequest;
import edu.bilkent.cs319.team9.ta_management_system.model.SwapStatus;
import lombok.*;

import java.time.LocalDateTime;

/**
 * A single record in the “swap” report.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SwapReportDto {
    private Long id;
    private String requesterMail;    // TA who asked for the swap
    private String targetMail;       // TA whose slot is being requested
    private SwapStatus status;
    private LocalDateTime timestamp;
    private String details;

    /** Convert entity → DTO */
    public static SwapReportDto fromEntity(SwapRequest req) {
        return SwapReportDto.builder()
                .id(req.getId())
                .requesterMail(req.getTa().getEmail())
                .targetMail(req.getTargetProctorAssignment().getAssignedTA().getEmail())
                .status(req.getStatus())
                .timestamp(req.getRequestDate())
                .details("Swap " +
                        req.getProctorAssignment().getId() +
                        " → " +
                        req.getTargetProctorAssignment().getId())
                .build();
    }
}
