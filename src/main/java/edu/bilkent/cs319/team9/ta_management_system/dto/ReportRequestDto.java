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
    private ReportRequestStatus status;
    private LocalDateTime createdAt;

    // ← new!
    private LocalDateTime fromTime;
    private LocalDateTime toTime;

    private String details;

    /** Convert entity → DTO */
    public static ReportRequestDto fromEntity(ReportRequest r) {
        return ReportRequestDto.builder()
                .id(r.getId())
                .reportType(r.getReportType())
                .requesterId(r.getRequesterId())
                .status(r.getStatus())
                .createdAt(r.getCreatedAt())
                .fromTime(r.getFromTime())
                .toTime(r.getToTime())
                .details(r.getDetails())
                .build();
    }

    /** Convert DTO → entity */
    public ReportRequest toEntity() {
        return ReportRequest.builder()
                .id(id)
                .reportType(reportType)
                .requesterId(requesterId)
                .status(status)
                .fromTime(fromTime)
                .toTime(toTime)
                .details(details)
                .build();
    }
}
