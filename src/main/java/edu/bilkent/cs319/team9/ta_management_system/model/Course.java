package edu.bilkent.cs319.team9.ta_management_system.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@SuperBuilder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Course {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    private String courseCode;
    private String courseName;
    private Integer credits;

    @OneToMany(mappedBy = "course")
    private Set<Offering> offerings;
}
