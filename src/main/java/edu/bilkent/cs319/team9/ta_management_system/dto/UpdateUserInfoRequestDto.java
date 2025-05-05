package edu.bilkent.cs319.team9.ta_management_system.dto;

import lombok.Data;

@Data
public class UpdateUserInfoRequestDto {
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String email;
}
