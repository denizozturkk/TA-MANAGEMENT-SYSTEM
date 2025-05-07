package edu.bilkent.cs319.team9.ta_management_system.model;

import jakarta.persistence.*;
import lombok.*; // Lombok for getters and setters.
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "users",
        uniqueConstraints = @UniqueConstraint(columnNames = "email"))
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name="dtype")
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public abstract class User {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    private String email; // becomes `email` by default

    @Column(name = "phone_number")
    private String phoneNumber;

    private String password; // `password`

    @Column(name = "photourl")
    private String photoURLss;  // explicitly map to `photourl`

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;
}
