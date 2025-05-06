package edu.bilkent.cs319.team9.ta_management_system.dto;

import lombok.Data;

import java.util.Set;

@Data
public class CourseDto {
    private Long id;
    private String courseCode;
    private String courseName;
    private Integer credits;
    private Set<Long> offeringIds;
}
