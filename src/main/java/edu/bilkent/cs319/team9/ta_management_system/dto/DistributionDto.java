package edu.bilkent.cs319.team9.ta_management_system.dto;

import lombok.Data;

import java.util.List;

@Data
public class DistributionDto {
    private Long examId;
    private Long classroomId;
    private List<Long> studentIds;



    public DistributionDto() {}
    public DistributionDto(Long examId, Long classroomId, List<Long> studentIds) {
        this.examId      = examId;
        this.classroomId = classroomId;
        this.studentIds  = studentIds;
    }
}