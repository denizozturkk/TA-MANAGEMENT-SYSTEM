package edu.bilkent.cs319.team9.ta_management_system.service;

import edu.bilkent.cs319.team9.ta_management_system.dto.ClassroomDistributionDto;

/**
 * Compute how to split an exam’s students into its rooms.
 */
public interface ClassroomDistributionService {
    ClassroomDistributionDto distribute(Long examId, boolean randomize);
}