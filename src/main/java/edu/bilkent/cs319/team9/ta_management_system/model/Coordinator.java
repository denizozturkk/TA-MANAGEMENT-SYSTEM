package edu.bilkent.cs319.team9.ta_management_system.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@DiscriminatorValue("Coordinator")
@Data
@NoArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class Coordinator extends FacultyMember {
    // nothing extra
}