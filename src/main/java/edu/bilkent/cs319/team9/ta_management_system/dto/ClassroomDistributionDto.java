package edu.bilkent.cs319.team9.ta_management_system.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Carries the examId plus one DistributionDto per classroom.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClassroomDistributionDto {
    /**
     * The exam for which we distributed students
     */
    private Long examId;

    /**
     * One entry per room:
     *   - classroomId
     *   - list of studentIds assigned there
     */
    private List<DistributionDto> distributions;
}