package edu.bilkent.cs319.team9.ta_management_system.dto;

import lombok.Data;

@Data
public class ClassroomDto {
    private Long id;
    private String building;
    private String roomNumber;
    private Integer capacity;
    private Integer examCapacity;
}
