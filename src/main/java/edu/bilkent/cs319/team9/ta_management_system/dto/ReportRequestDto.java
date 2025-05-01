// src/main/java/edu/bilkent/cs319/team9/ta_management_system/dto/ReportRequestDto.java
package edu.bilkent.cs319.team9.ta_management_system.dto;

import edu.bilkent.cs319.team9.ta_management_system.model.ReportRequest;
import edu.bilkent.cs319.team9.ta_management_system.model.ReportRequestStatus;
import edu.bilkent.cs319.team9.ta_management_system.model.ReportType;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportRequestDto {
    private Long id;
    private ReportType reportType;
    private Long requesterId;
    private Long receiverId;
    private ReportRequestStatus status;
    private LocalDateTime createdAt;
    private String details;

    /** Convert entity → DTO */
    public static ReportRequestDto fromEntity(ReportRequest r) {
        return ReportRequestDto.builder()
                .id(r.getId())
                .reportType(r.getReportType())
                .requesterId(r.getRequesterId())
                .receiverId(r.getReceiverId())
                .status(r.getStatus())
                .createdAt(r.getCreatedAt())
                .details(r.getDetails())
                .build();
    }
}
