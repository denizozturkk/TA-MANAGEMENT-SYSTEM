// src/main/java/edu/bilkent/cs319/team9/ta_management_system/dto/DutyReportDto.java
package edu.bilkent.cs319.team9.ta_management_system.dto;

import edu.bilkent.cs319.team9.ta_management_system.model.DutyLog;
import edu.bilkent.cs319.team9.ta_management_system.model.DutyType;  // your enum
import lombok.*;

import java.time.LocalDateTime;

/**
 * A single record in the “duty” report (TA hours, grading, office‐hours, etc.).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DutyReportDto {
    private Long id;                   // primary key of the log entry
    private String actorMail;          // TA who logged the duty
    private DutyType dutyType;
    private LocalDateTime timestamp;   // when it was recorded
    private String details;            // e.g. “Grading for Course Y: 3h”

    public static DutyReportDto fromEntity(DutyLog log) {
        return DutyReportDto.builder()
                .id(log.getId())
                .actorMail(log.getTa().getEmail())
                // assume you have an enum DutyType that matches your taskType strings:
                .dutyType(log.getTaskType())
                .timestamp(log.getDateTime())
                .details(
                        String.format("%s for %s: %dh",
                                log.getTaskType(),
                                log.getFaculty().getOfferings().stream().findFirst()
                                        .map(o -> o.getCourse().getCourseName()).orElse("unknown"),
                                log.getWorkload()))
                .build();
    }
}
