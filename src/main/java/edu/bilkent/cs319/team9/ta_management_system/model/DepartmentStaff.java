package edu.bilkent.cs319.team9.ta_management_system.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Entity
@DiscriminatorValue("DepartmentStaff")
@Data
@NoArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true, onlyExplicitlyIncluded = true)
public class DepartmentStaff extends User {
    private String department;

    @OneToMany(mappedBy = "definedBy", cascade = CascadeType.ALL)
    private List<Exam> examsDefined;


}