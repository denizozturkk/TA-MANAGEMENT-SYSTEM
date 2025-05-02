package edu.bilkent.cs319.team9.ta_management_system.dto;

import edu.bilkent.cs319.team9.ta_management_system.model.LogEntry;
import edu.bilkent.cs319.team9.ta_management_system.model.LogEventType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * A single record in the “login” report, showing who and when.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LogReportDto {
    private Long id;
    private String actorMail;
    private LocalDateTime timestamp;
    private String details;

    public static LogReportDto fromEntity(LogEntry e) {
        return LogReportDto.builder()
                .id(e.getId())
                .actorMail(e.getEmail())
                .timestamp(e.getTimestamp())
                .details(e.getDetails())
                .build();
    }
}
