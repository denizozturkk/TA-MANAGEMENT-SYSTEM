package edu.bilkent.cs319.team9.ta_management_system.dto;

import lombok.*;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentDto {
    private Long id;
    private String studentID;
    private String firstName;
    private String lastName;
    private Set<Long> offeringIds;
}