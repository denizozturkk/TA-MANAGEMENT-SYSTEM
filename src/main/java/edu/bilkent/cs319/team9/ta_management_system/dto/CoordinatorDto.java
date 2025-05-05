package edu.bilkent.cs319.team9.ta_management_system.dto;

import edu.bilkent.cs319.team9.ta_management_system.model.Role;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CoordinatorDto {
    private Long id;

    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String photoURL;
    private String password;

    private Role role;
    private String department;
}