package edu.bilkent.cs319.team9.ta_management_system.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BusyHourDto {
    private Long id;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private Long taId;
}