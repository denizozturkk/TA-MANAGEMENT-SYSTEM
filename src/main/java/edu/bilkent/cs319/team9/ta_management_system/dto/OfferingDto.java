package edu.bilkent.cs319.team9.ta_management_system.dto;

import edu.bilkent.cs319.team9.ta_management_system.model.*;
import lombok.Data;

import java.util.Set;
@Data
public class OfferingDto {
    private Long id;
    private String section;
    private String semester;
    private Integer year;
    private Long instructorId; // Reference by ID
    private Long courseId;
    private String courseCode;
    private Set<Long> taIds;
    private Set<Long> studentIds;
    private Set<Long> examIds;
    private Long semesterDataId;
}

