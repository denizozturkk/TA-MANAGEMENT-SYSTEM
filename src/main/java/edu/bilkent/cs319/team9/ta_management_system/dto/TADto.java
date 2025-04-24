package edu.bilkent.cs319.team9.ta_management_system.dto;

import edu.bilkent.cs319.team9.ta_management_system.model.DegreeStatus;
import lombok.Data;

@Data
public class TADto {
    private Long id;
    private String department;
    private DegreeStatus msPhdStatus;
    private Float totalWorkload;
    private String email;
    private String fullName;
}
