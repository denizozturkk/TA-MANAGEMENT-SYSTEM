package edu.bilkent.cs319.team9.ta_management_system.model;

import jakarta.persistence.*;
import lombok.*; // Lombok for getters and setters.
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "users")
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "user_type")
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public abstract class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "password", nullable = false)
    private String password;

    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String userName;
    private String passwordHash;
    private String photoURL;
    private Role role;
}
