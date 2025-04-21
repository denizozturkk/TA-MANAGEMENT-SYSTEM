package edu.bilkent.cs319.team9.ta_management_system.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.Set;

@Entity
@DiscriminatorValue("FacultyMember")
@Data
@NoArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@PrimaryKeyJoinColumn(name="user_id")
public class FacultyMember extends User {
    @OneToMany(mappedBy = "instructor")
    private Set<Offering> offerings;

    @OneToMany(mappedBy = "faculty")
    private Set<DutyLog> approvedDuties;

    @OneToMany(mappedBy = "faculty")
    private Set<Exam> exams;
}