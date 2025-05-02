package edu.bilkent.cs319.team9.ta_management_system.dto;

import edu.bilkent.cs319.team9.ta_management_system.model.DegreeStatus;
import edu.bilkent.cs319.team9.ta_management_system.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

/**
 * Data Transfer Object for creating and viewing TA entities.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TADto {
    // ----- Inherited User fields -----
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String password;
    private String photoURL;
    private Role role;

    // ----- TA-specific fields -----
    private Float totalWorkload;
    private String department;
    private DegreeStatus msPhdStatus;

    private Set<Long> offerings;

    private String fullName;

    private Set<Long> dutyLogIds;

}
