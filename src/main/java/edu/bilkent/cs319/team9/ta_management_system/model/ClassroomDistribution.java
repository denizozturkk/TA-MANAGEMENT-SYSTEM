package edu.bilkent.cs319.team9.ta_management_system.model;

import edu.bilkent.cs319.team9.ta_management_system.dto.DistributionDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * A simple wrapper for the per‐room splits of student IDs for one exam.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClassroomDistribution {
    private Long examId;
    private List<DistributionDto> distributions;
}