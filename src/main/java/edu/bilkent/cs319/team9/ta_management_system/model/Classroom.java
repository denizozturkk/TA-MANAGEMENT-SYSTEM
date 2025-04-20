package edu.bilkent.cs319.team9.ta_management_system.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@SuperBuilder
public class Classroom {
    @Id
    private String roomNumber;

    private Integer capacity;
    private Integer examCapacity;

    @OneToMany(mappedBy = "classroom")
    private Set<ProctorAssignment> proctorAssignments;
}
