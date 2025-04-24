package edu.bilkent.cs319.team9.ta_management_system.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class ChangeContactRequest {
    @Pattern(regexp="^\\+?[0-9]{7,15}$", message="Bad Phone Format")
    private String phoneNumber;
    @Email(message="Bilkent Email Required")
    private String email;
}