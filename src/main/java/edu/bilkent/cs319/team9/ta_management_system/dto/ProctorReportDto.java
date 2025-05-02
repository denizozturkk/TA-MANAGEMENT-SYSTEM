// src/main/java/edu/bilkent/cs319/team9/ta_management_system/dto/ProctorReportDto.java
package edu.bilkent.cs319.team9.ta_management_system.dto;

import edu.bilkent.cs319.team9.ta_management_system.model.ProctorAssignment;
import lombok.*;

import java.time.LocalDateTime;

/**
 * A single record in the “proctor” report.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProctorReportDto {
    private Long id;                   // primary key of the log entry
    private String actorMail;          // TA who got assigned or swapped proctor duty
    private String status;             // e.g. ASSIGNED, CANCELLED, etc.
    private Long classId;
    private String examName;
    private LocalDateTime timestamp;   // when it happened
    private String details;            // e.g. “Assigned to Exam Z for 2h”

    /**
     * Convert a ProctorAssignment entity into a report DTO.
     */
    public static ProctorReportDto fromEntity(ProctorAssignment pa) {
        // you need some timestamp: if you recorded assignment time in the entity,
        // replace pa.getAssignedAt() with the real getter.
        LocalDateTime eventTime = pa.getExam().getDateTime();

        return ProctorReportDto.builder()
                .id(pa.getId())
                .actorMail(pa.getAssignedTA().getEmail())
                .status(pa.getStatus().name())
                .classId(pa.getClassroom().getId())
                .examName(pa.getExam().getExamName())
                .timestamp(eventTime)
                .details(
                        String.format("Assigned to %s in room %s",
                                pa.getExam().getExamName(),
                                pa.getClassroom().getRoomNumber())
                )
                .build();
    }
}
