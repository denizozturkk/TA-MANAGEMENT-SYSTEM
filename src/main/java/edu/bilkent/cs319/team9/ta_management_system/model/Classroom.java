package edu.bilkent.cs319.team9.ta_management_system.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.List;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@SuperBuilder
public class Classroom {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "classroom_id")
    private Long id;

    private String building;
    private String roomNumber;
    private Integer capacity;
    private Integer examCapacity;

    @OneToMany(mappedBy = "classroom")
    private List<ProctorAssignment> proctorAssignments;
}
