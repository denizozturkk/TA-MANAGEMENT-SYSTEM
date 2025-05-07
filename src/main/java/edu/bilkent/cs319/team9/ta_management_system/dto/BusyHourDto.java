// src/main/java/edu/bilkent/cs319/team9/ta_management_system/dto/BusyHourDto.java
package edu.bilkent.cs319.team9.ta_management_system.dto;

import lombok.Data;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Data
public class BusyHourDto {
    private Long id;
    private DayOfWeek dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;
    private Long taId;     // so we know whose slot it is
}
