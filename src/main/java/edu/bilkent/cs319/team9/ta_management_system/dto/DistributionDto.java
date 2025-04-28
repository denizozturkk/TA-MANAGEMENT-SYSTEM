package edu.bilkent.cs319.team9.ta_management_system.dto;

import java.util.List;

public class DistributionDto {
    private String courseCode;
    private List<String> studentIds;

    public DistributionDto(String courseCode, List<String> studentIds) {
        this.courseCode = courseCode;
        this.studentIds = studentIds;
    }

    // getters & setters
}
